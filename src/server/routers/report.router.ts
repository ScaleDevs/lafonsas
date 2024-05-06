import dayjs from 'dayjs';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { ReportService } from '@/server/services/reports.service';

export const reportRouter = createRouter()
  .middleware(authMiddleware)
  .query('getSKUReports', {
    input: z.object({
      storeId: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }),
    async resolve({ input }) {
      return ReportService.getSKUReports({
        startDate: dayjs(input.startDate).startOf('day').toISOString(),
        endDate: dayjs(input.endDate).endOf('day').toISOString(),
        storeId: input.storeId,
      });
    },
  })
  .query('getDeductionsReport', {
    input: z.object({
      storeId: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }),
    async resolve({ input }) {
      return ReportService.getDeductionsReport({
        startDate: dayjs(input.startDate).startOf('day').toISOString(),
        endDate: dayjs(input.endDate).endOf('day').toISOString(),
        storeId: input.storeId,
      });
    },
  });
