import { IExpense } from '@/utils/types';
import { ExpenseRepository, IFindExpensesInput } from '@/repo/expense.repo';
import { TRPCError } from '@trpc/server';

class Service {
  public async createExpense(expenseData: Omit<IExpense, 'id'>) {
    try {
      return ExpenseRepository.createExpense(expenseData);
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
