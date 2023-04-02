import dayjs from 'dayjs';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { BillService } from '@/server/services/bill.service';

export const billRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('create', {
    input: z.object({
      billData: z.object({
        vendor: z.string(),
        date: z.string(),
        invoiceRefNo: z.string(),
        amount: z.number(),
      }),
      expenses: z.array(
        z.object({
          date: z.string(),
          amount: z.number(),
          description: z.string(),
          accountId: z.string(),
        }),
      ),
    }),
    resolve({ input }) {
      return BillService.createBill(input.billData, input.expenses);
    },
  })
  .mutation('update', {
    input: z.object({
      billId: z.string(),
      partialData: z.object({
        vendor: z.string().optional(),
        date: z.string().optional(),
        invoiceRefNo: z.string().optional(),
        amount: z.number().optional(),
      }),
    }),
    resolve({ input }) {
      return BillService.updateBill(input.billId, input.partialData);
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve({ input }) {
      return BillService.deleteBill(input);
    },
  })
  .query('getById', {
    input: z.object({
      refNo: z.string().optional(),
      billId: z.string().optional(),
    }),
    resolve({ input }) {
      return BillService.findBill(input);
    },
  })
  .query('getMany', {
    input: z.object({
      vendor: z.string().optional(),
      dateFilter: z.object({
        startDate: z.string(),
        endDate: z.string(),
      }),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
    }),
    async resolve({ input }) {
      return BillService.findBills({
        ...input,
        dateFilter: {
          startDate: dayjs(input.dateFilter.startDate).startOf('day').toISOString(),
          endDate: dayjs(input.dateFilter.endDate).endOf('day').toISOString(),
        },
      });
    },
  });
