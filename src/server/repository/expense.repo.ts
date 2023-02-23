import { Prisma } from '@prisma/client';
import prisma from './prisma.client';
import { IExpense, IPaginationInputs } from '@/utils/types';

export type IFindExpensesInput = {
  vendor?: string;
  startDate: Date;
  endDate: Date;
} & IPaginationInputs;

class Respository {
  public async createExpense(expenseData: Omit<IExpense, 'expenseId'>) {
    return prisma.expense.create({
      data: {
        ...expenseData,
      },
    });
  }

  public async findExpenseById(expenseId: string) {
    return prisma.expense.findFirst({ where: { expenseId } });
  }

  public async findExpenses({ startDate, endDate, vendor, page, limit }: IFindExpensesInput) {
    const whereFilter: Prisma.ExpenseWhereInput = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (!!vendor)
      whereFilter['vendor'] = {
        contains: vendor,
      };

    const result = await prisma.expense.findMany({
      where: whereFilter,
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
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
