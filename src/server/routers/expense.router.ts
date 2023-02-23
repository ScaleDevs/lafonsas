import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { ExpenseService } from '@/server/services/expense.service';
import { IExpense } from '@/utils/types';

export const expenseRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('create', {
    input: z.object({
      vendor: z.string(),
      date: z.date(),
      invoiceRefNo: z.string(),
      amount: z.number(),
      entries: z.array(
        z.object({
          date: z.date(),
          account: z.string(),
          amount: z.number(),
          description: z.string(),
        }),
      ),
    }),
    resolve({ input }) {
      const data: Omit<IExpense, 'expenseId'> = {
        ...input,
      };

      return ExpenseService.createExpense(data);
    },
  })
  .mutation('update', {
    input: z.object({
      expenseId: z.string(),
      partialData: z.object({
        name: z.string().optional(),
        description: z.string().optional().nullable(),
        category: z.string().optional(),
        expenseDate: z.string().optional(),
        amount: z.number().optional(),
      }),
    }),
    resolve({ input }) {
      const partialData = {
        ...input.partialData,
        expenseDate: input.partialData.expenseDate === undefined ? undefined : new Date(input.partialData.expenseDate),
      };

      return ExpenseService.updateExpense(input.expenseId, partialData);
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve({ input }) {
      return ExpenseService.deleteExpense(input);
    },
  })
  .query('getById', {
    input: z.string(),
    resolve({ input }) {
      return ExpenseService.findExpenseById(input);
    },
  })
  .query('getMany', {
    input: z.object({
      name: z.string().optional(),
      category: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
    }),
    async resolve({ input }) {
      return ExpenseService.findExpenses({
        ...input,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate + ' 23:59:59'),
      });
    },
  });
