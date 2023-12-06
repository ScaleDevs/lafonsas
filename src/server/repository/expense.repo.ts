import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import prisma from './prisma.client';
import { IExpense, IPaginationInputs } from '@/utils/types';

export type IFindExpensesInput = {
  accountId?: string;
  billId?: string;
  dateFilter?: {
    startDate: Date | string;
    endDate: Date | string;
  };
} & IPaginationInputs;

class Respository {
  public async createExpense(expenseData: Omit<IExpense, 'expenseId'>) {
    return prisma.expense.create({
      data: {
        ...expenseData,
      },
    });
  }

  public async createManyExpense(records: Omit<IExpense, 'expenseId'>[]) {
    return prisma.expense.createMany({
      data: records,
    });
  }

  public async findExpenseById(expenseId: string) {
    return prisma.expense.findFirst({ where: { expenseId } });
  }

  public async findExpenses({ dateFilter, accountId, billId, page, limit, noLimit }: IFindExpensesInput) {
    const whereFilter: Prisma.ExpenseWhereInput = {};

    if (!dateFilter && !accountId && !billId)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'There are no filters applied!' });

    if (!!dateFilter)
      whereFilter['date'] = {
        gte: dateFilter.startDate,
        lte: dateFilter.endDate,
      };

    if (!!accountId)
      whereFilter['accountId'] = {
        equals: accountId,
      };

    if (!!billId)
      whereFilter['billId'] = {
        equals: billId,
      };

    const result = await prisma.expense.findMany({
      where: whereFilter,
      orderBy: { date: 'asc' },
      skip: page > 0 ? (page - 1) * limit : 0,
      take: !!noLimit ? undefined : limit,
    });

    const totalCount = await prisma.expense.count({ where: whereFilter });

    return {
      pageCount: Math.ceil(totalCount / limit),
      records: result,
    };
  }

  public async updateExpense(expenseId: string, expensePartialData: Partial<IExpense>) {
    return prisma.expense.update({
      where: {
        expenseId,
      },
      data: expensePartialData,
    });
  }

  public async deleteExpense(expenseId: string) {
    return prisma.expense.delete({
      where: {
        expenseId,
      },
    });
  }
}

export const ExpenseRepository = new Respository();
