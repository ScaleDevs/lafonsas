import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { DeliveryService } from '@/server/services/delivery.service';

export const deliveryRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('create', {
    input: z.object({
      storeId: z.string(),
      postingDate: z.string().nullable(),
      deliveryNumber: z.string(),
      amount: z.number(),
      badOrder: z.number().nullable(),
      widthHoldingTax: z.number().nullable(),
      otherDeduction: z.number().nullable(),
      amountPaid: z.number().nullable(),
      checkNumber: z.string().nullable(),
      checkDate: z.string().nullable(),
      orders: z.array(
        z.object({
          size: z.string(),
          quantity: z.number(),
          price: z.number(),
        }),
      ),
      returnSlip: z.array(
        z.object({
          size: z.string(),
          quantity: z.number(),
          price: z.number(),
        }),
      ),
    }),
    resolve({ input }) {
      return DeliveryService.createDelivery({
        ...input,
        postingDate: !!input.postingDate ? new Date(input.postingDate) : null,
        checkDate: !!input.checkDate ? new Date(input.checkDate) : null,
      });
    },
  })
  .query('getById', {
    input: z.string(),
    resolve({ input }) {
      return DeliveryService.findDeliveryById(input);
    },
  })
  .query('getByDeliveryNumber', {
    input: z.string(),
    resolve({ input }) {
      return DeliveryService.findDeliveryByDeliveryNumber(input);
    },
  })
  .query('getDeliveriesByDate', {
    input: z.object({
      store: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
    }),
    resolve({ input }) {
      return DeliveryService.findDeliveries({
        ...input,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate + ' 23:59:59'),
      });
    },
  });
