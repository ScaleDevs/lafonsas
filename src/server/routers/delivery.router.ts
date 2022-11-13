import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { DeliveryService } from '@/server/services/delivery.service';

export const deliveryRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('create', {
    input: z.object({
      storeId: z.string(),
      postingDate: z.string(),
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
        postingDate: new Date(input.postingDate),
        checkDate: !!input.checkDate ? new Date(input.checkDate) : null,
      });
    },
  })
  .mutation('update', {
    input: z.object({
      deliveryId: z.string(),
      partialData: z.object({
        storeId: z.string().optional(),
        postingDate: z.string().optional(),
        deliveryNumber: z.string().optional(),
        amount: z.number().optional(),
        badOrder: z.number().nullable().optional(),
        widthHoldingTax: z.number().nullable().optional(),
        otherDeduction: z.number().nullable().optional(),
        amountPaid: z.number().nullable().optional(),
        checkNumber: z.string().nullable().optional(),
        checkDate: z.string().nullable().optional(),
        orders: z
          .array(
            z.object({
              size: z.string(),
              quantity: z.number(),
              price: z.number(),
            }),
          )
          .optional(),
        returnSlip: z
          .array(
            z.object({
              size: z.string(),
              quantity: z.number(),
              price: z.number(),
            }),
          )
          .optional(),
      }),
    }),
    resolve({ input }) {
      const partialData = {
        ...input.partialData,
        postingDate: input.partialData.postingDate === undefined ? undefined : new Date(input.partialData.postingDate),
        checkDate:
          input.partialData.checkDate === undefined
            ? undefined
            : !!input.partialData.checkDate
            ? new Date(input.partialData.checkDate)
            : null,
      };

      return DeliveryService.updateDelivery(input.deliveryId, partialData);
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve({ input }) {
      return DeliveryService.deleteDelivery(input);
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
