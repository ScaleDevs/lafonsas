import { Prisma } from '@prisma/client';
import { IExpense, IBill } from '@/utils/types';
import { ExpenseRepository } from '@/repo/expense.repo';
import { BillRepository, IFindBillsInput } from '@/repo/bill.repo';
import { TRPCError } from '@trpc/server';
import prisma from '../repository/prisma.client';

type ErrorCode =
  | 'INTERNAL_SERVER_ERROR'
  | 'BAD_REQUEST'
  | 'PARSE_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'METHOD_NOT_SUPPORTED'
  | 'TIMEOUT'
  | 'CONFLICT'
  | 'PRECONDITION_FAILED'
  | 'PAYLOAD_TOO_LARGE'
  | 'CLIENT_CLOSED_REQUEST';

class Service {
  public async createBill(billData: Omit<IBill, 'billId'>, expensesData: Omit<IExpense, 'expenseId' | 'billId'>[]) {
    try {
      const billResult = await BillRepository.createBill({
        ...billData,
        date: new Date(billData.date),
      });
      const createExpensesParams = expensesData.map((expense) => {
        return {
          ...expense,
          date: new Date(expense.date),
          billId: billResult.billId,
        };
      });
      await ExpenseRepository.createManyExpense(createExpensesParams);
      return true;
    } catch (err: any) {
      console.log('err', err);
      let code: ErrorCode = 'INTERNAL_SERVER_ERROR';
      let message = 'Something went wrong';

      if (err.code === 'P2002') {
        code = 'BAD_REQUEST';
        message = 'Reference Number already exist!';
      }

      throw new TRPCError({ code, message });
    }
  }

  public async findBill({ refNo, billId }: { refNo?: string; billId?: string }) {
    try {
      if (!refNo && !billId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No ID Provided' });

      const whereFilter: Prisma.BillWhereInput = {};

      if (billId) whereFilter['billId'] = billId;
      else if (refNo) whereFilter['invoiceRefNo'] = refNo;

      const bill = await prisma.bill.findFirst({
        where: whereFilter,
        include: {
          expenses: {
            select: {
              expenseId: true,
              date: true,
              amount: true,
              description: true,
              accountId: true,
              account: {
                select: {
                  accountName: true,
                },
              },
            },
          },
        },
      });

      if (!bill) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bill does not Exist' });

      return bill;
    } catch (err) {
      console.log(err);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findBills(params: IFindBillsInput) {
    try {
      return BillRepository.findBills(params);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async updateBill(billId: string, partialData: Partial<IBill>) {
    try {
      return BillRepository.updateBill(billId, partialData);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async deleteBill(billId: string) {
    try {
      return BillRepository.deleteBill(billId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }
}

export const BillService = new Service();
