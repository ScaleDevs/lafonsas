import dayjs from 'dayjs';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { PaymentService } from '@/server/services/payment.service';

export const paymentRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('create', {
    input: z.object({
      paymentData: z.object({
        vendor: z.string(),
        checkNumber: z.string(),
        checkDate: z.string(),
        amount: z.number(),
        badOrder: z.number().nullable(),
        widthHoldingTax: z.number().nullable(),
        otherDeduction: z.number().nullable(),
      }),
      deliveryIds: z.array(z.string()),
    }),
    resolve({ input }) {
      return PaymentService.createPayment(input.paymentData, input.deliveryIds);
    },
  })
  .mutation('update', {
    input: z.object({
      paymentId: z.string(),
      partialData: z.object({
        vendor: z.string().optional(),
        amount: z.number().optional(),
        checkDate: z.string().optional(),
        badOrder: z.number().optional(),
        widthHoldingTax: z.number().optional(),
        otherDeduction: z.number().optional(),
      }),
    }),
    resolve({ input }) {
      return PaymentService.updatePayment(input.paymentId, input.partialData);
    },
  })
  .mutation('addDelivery', {
    input: z.string(),
    resolve({ input }) {
      return PaymentService.removeDeliveryFromPayment(input);
    },
  })
  .mutation('removeDelivery', {
    input: z.object({
      deliveryId: z.string(),
      paymentId: z.string(),
    }),
    resolve({ input }) {
      return PaymentService.addDeliveryFromPayment(input.deliveryId, input.paymentId);
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve({ input }) {
      return PaymentService.deletePayment(input);
    },
  })
  .query('getById', {
    input: z.string(),
    resolve({ input }) {
      return PaymentService.findPaymentById(input);
    },
  })
  .query('getMany', {
    input: z.object({
      paymentId: z.string().optional(),
      checkNumber: z.string().optional(),
      dateFilters: z.object({
        startDate: z.string(),
        endDate: z.string(),
      }),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
    }),
    async resolve({ input }) {
      return PaymentService.findPayments({
        ...input,
        dateFilter: {
          startDate: dayjs(input.dateFilters.startDate).startOf('day').toISOString(),
          endDate: dayjs(input.dateFilters.endDate).endOf('day').toISOString(),
        },
      });
    },
  });
