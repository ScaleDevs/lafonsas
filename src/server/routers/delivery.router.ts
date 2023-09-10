import dayjs from 'dayjs';
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
        paymentId: null,
        postingDate: new Date(input.postingDate),
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
  .query('getDeliveriesByStoreId', {
    input: z.string(),
    resolve({ input }) {
      return DeliveryService.findDeliveriesByStoreId(input);
    },
  })
  .query('getDeliveries', {
    input: z.object({
      deliveryNumber: z.string().optional(),
      storeId: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
    }),
    async resolve({ input }) {
      if (input.deliveryNumber) {
        const delivery = await DeliveryService.findDeliveryByDeliveryNumber(input.deliveryNumber);
        return {
          pageCount: 1,
          records: delivery ? [delivery] : [],
        };
      }
      return DeliveryService.findDeliveries({
        ...input,
        startDate: dayjs(input.startDate).startOf('day').toISOString(),
        endDate: dayjs(input.endDate).endOf('day').toISOString(),
      });
    },
  });
