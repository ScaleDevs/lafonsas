import dayjs from 'dayjs';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { ExpenseService } from '@/server/services/expense.service';

export const expenseRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('update', {
    input: z.object({
      expenseId: z.string(),
      partialData: z.object({
        date: z.string().optional(),
        amount: z.number().optional(),
        description: z.string().optional(),
      }),
    }),
    resolve({ input }) {
      return ExpenseService.updateExpense(input.expenseId, input.partialData);
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
      accountId: z.string().optional(),
      billId: z.string().optional(),
      dateFilters: z.object({
        startDate: z.string(),
        endDate: z.string(),
      }),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
    }),
    async resolve({ input }) {
      return ExpenseService.findExpenses({
        ...input,
        dateFilter: {
          startDate: dayjs(input.dateFilters.startDate).startOf('day').toISOString(),
          endDate: dayjs(input.dateFilters.endDate).endOf('day').toISOString(),
        },
      });
    },
  });
