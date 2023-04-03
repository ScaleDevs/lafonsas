import dayjs from 'dayjs';
import { IExpense } from '@/utils/types';
import { ExpenseRepository, IFindExpensesInput } from '@/repo/expense.repo';
import { AccountRepository } from '@/repo/account.repo';
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
      const expenses = [];

      for (const expense of expensesResult.records) {
        const account = await AccountRepository.findAccountById(expense.accountId);
        expenses.push({
          ...expense,
          accountName: account?.accountName || '',
        });
      }

      return {
        pageCount: expensesResult.pageCount,
        records: expenses,
      };
    } catch (err) {
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
