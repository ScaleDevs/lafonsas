import dayjs from 'dayjs';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { ExpenseService } from '@/server/services/expense.service';

export const expenseRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('create', {
    input: z.object({
      vendor: z.string(),
      date: z.string(),
      invoiceRefNo: z.string(),
      amount: z.number(),
      entries: z.array(
        z.object({
          date: z.string(),
          account: z.string(),
          amount: z.number(),
          description: z.string(),
        }),
      ),
    }),
    resolve({ input }) {
      return ExpenseService.createExpense({
        ...input,
      });
    },
  })
  .mutation('update', {
    input: z.object({
      expenseId: z.string(),
      partialData: z.object({
        vendor: z.string().optional(),
        date: z.string().optional(),
        invoiceRefNo: z.string().optional(),
        amount: z.number().optional(),
        entries: z
          .array(
            z.object({
              date: z.string(),
              account: z.string(),
              amount: z.number(),
              description: z.string(),
            }),
          )
          .optional(),
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
  .query('getByRefNo', {
    input: z.string(),
    resolve({ input }) {
      return ExpenseService.findExpenseByReferenceNumber(input);
    },
  })
  .query('getMany', {
    input: z.object({
      vendor: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
    }),
    async resolve({ input }) {
      return ExpenseService.findExpenses({
        ...input,
        startDate: dayjs(input.startDate).startOf('day').toISOString(),
        endDate: dayjs(input.endDate).endOf('day').toISOString(),
      });
    },
  });
