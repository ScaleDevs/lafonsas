import dayjs from 'dayjs';
import { IExpense } from '@/utils/types';
import { ExpenseRepository, IFindExpensesInput, IGetExportsData } from '@/repo/expense.repo';
import { TRPCError } from '@trpc/server';

class Service {
  public async createExpense(data: Omit<IExpense, 'expenseId'>) {
    try {
      return ExpenseRepository.createExpense(data);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findExpenseById(expenseId: string) {
    try {
      return ExpenseRepository.findExpenseById(expenseId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findExpenses(inputs: IFindExpensesInput) {
    try {
      const expensesResult = await ExpenseRepository.findExpenses(inputs);

      return {
        pageCount: expensesResult.pageCount,
        records: expensesResult.records,
      };
    } catch (err) {
      console.error('Error => findExpenses() :: ', err);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async getExportsData(inputs: IGetExportsData) {
    try {
      const expensesResult = await ExpenseRepository.getExportsData(inputs);

      return expensesResult;
    } catch (err) {
      console.error('Error => getExportsData() :: ', err);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async updateExpense(expenseId: string, partialData: Partial<IExpense>) {
    try {
      return ExpenseRepository.updateExpense(expenseId, {
        ...partialData,
        date: partialData.date ? dayjs.tz(partialData.date).toISOString() : undefined,
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async deleteExpense(expenseId: string) {
    try {
      return ExpenseRepository.deleteExpense(expenseId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }
}

export const ExpenseService = new Service();
