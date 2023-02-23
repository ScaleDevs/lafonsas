import dayjs from 'dayjs';
import { IExpense } from '@/utils/types';
import { ExpenseRepository, IFindExpensesInput } from '@/repo/expense.repo';
import { TRPCError } from '@trpc/server';

class Service {
  public async createExpense(data: Omit<IExpense, 'expenseId'>) {
    try {
      const entries = data.entries.map((entry) => {
        return {
          ...entry,
          date: dayjs.tz(entry.date).toISOString(),
        };
      });

      return ExpenseRepository.createExpense({
        ...data,
        date: dayjs.tz(data.date).toISOString(),
        entries,
      });
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

  public async findExpenseByReferenceNumber(refNo: string) {
    try {
      return ExpenseRepository.findExpenseByReferenceNumber(refNo);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findExpenses(inputs: IFindExpensesInput) {
    try {
      return ExpenseRepository.findExpenses(inputs);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async updateExpense(expenseId: string, expensePartialData: Partial<IExpense>) {
    try {
      return ExpenseRepository.updateExpense(expenseId, expensePartialData);
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
