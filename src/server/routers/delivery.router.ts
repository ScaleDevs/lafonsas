import dayjs from 'dayjs';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { DeliveryService } from '@/server/services/delivery.service';
import { StoreService } from '../services/store.service';

export const deliveryRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('create', {
    input: z.object({
      storeId: z.string(),
      postingDate: z.string(),
      deliveryNumber: z.string(),
      counterNumber: z.string().nullable(),
      productType: z.string(),
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
      storeId: z.string(),
      partialData: z.object({
        storeId: z.string().optional(),
        postingDate: z.string().optional(),
        deliveryNumber: z.string().optional(),
        counterNumber: z.string().optional(),
        productType: z.string().optional(),
        orders: z
          .array(
            z.object({
              size: z.string(),
              quantity: z.number(),
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
    async resolve({ input }) {
      const storeDetails = await StoreService.findStoreById(input.storeId);
      const currentProducts = storeDetails?.products;
      let newOrders = [] as { size: string; quantity: number; price: number }[];
      let newAmount = 0;

      if (!!input.partialData.orders && currentProducts) {
        newOrders = input.partialData.orders.map((ord) => {
          const price =
            (currentProducts.find((prd) => prd.size === ord.size)?.price || 0) *
            ord.quantity;

          newAmount += price;

          return {
            size: ord.size,
            quantity: ord.quantity,
            price,
          };
        });
      }

      const partialData = {
        ...input.partialData,
        orders: !!input.partialData.orders ? newOrders : undefined,
        amount: !!input.partialData.orders ? newAmount : undefined,
        postingDate:
          input.partialData.postingDate === undefined
            ? undefined
            : new Date(input.partialData.postingDate),
        counterNumber:
          input.partialData.counterNumber === ''
            ? null
            : input.partialData.counterNumber,
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
      productType: z.string().optional(),
      deliveryNumber: z.string().optional(),
      storeId: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
      noLimit: z.boolean().optional(),
    }),
    async resolve({ input }) {
      if (input.deliveryNumber) {
        const delivery =
          await DeliveryService.findDeliveryByDeliveryNumberPartial(
            input.deliveryNumber,
          );
        return {
          pageCount: 1,
          totalCount: 1,
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
