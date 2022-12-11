import prisma from './prisma.client';
import { IExpense, IPaginationInputs } from '@/utils/types';

export type IFindExpensesInput = {
  name?: string;
  category?: string;
  startDate: Date;
  endDate: Date;
} & IPaginationInputs;

class Respository {
  public async createExpense(expenseData: Omit<IExpense, 'id'>) {
    return prisma.expense.create({
      data: {
        ...expenseData,
      },
    });
  }

  public async findExpenseById(expenseId: string) {
    return prisma.expense.findFirst({ where: { id: expenseId } });
  }

  public async findExpenses({ startDate, endDate, name, category, page, limit }: IFindExpensesInput) {
    const whereFilter = {
      date: {
        gte: startDate,
        lte: endDate,
      },
      name,
      category,
    };

    const result = await prisma.expense.findMany({
      where: whereFilter,
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
      select: {
        id: true,
        name: true,
        category: true,
        expenseDate: true,
        amount: true,
      },
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
        id: expenseId,
      },
      data: expensePartialData,
    });
  }

  public async deleteExpense(expenseId: string) {
    return prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });
  }
}

export const ExpenseRepository = new Respository();
