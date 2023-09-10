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
        storeId: z.string(),
        modeOfPayment: z.enum(['BANK_TRANSFER', 'CHEQUE', 'CASH']),
        bankName: z.string().optional(),
        refNo: z.string(),
        refDate: z.string(),
        amount: z.number(),
        badOrder: z.number().default(0),
        widthHoldingTax: z.number().default(0),
        otherDeduction: z.number().default(0),
      }),
      deliveryIds: z.array(z.string()),
    }),
    resolve({ input }) {
      return PaymentService.createPayment(
        {
          ...input.paymentData,
          refDate: new Date(input.paymentData.refDate),
          bankName: input.paymentData.bankName ? input.paymentData.bankName : null,
        },
        input.deliveryIds,
      );
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
  .mutation('removeDelivery', {
    input: z.string(),
    resolve({ input }) {
      return PaymentService.removeDeliveryFromPayment(input);
    },
  })
  .mutation('attachDelivery', {
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
  .query('getPayment', {
    input: z.object({
      paymentId: z.string().optional(),
      refNo: z.string().optional(),
    }),
    resolve({ input }) {
      return PaymentService.findPayment(input);
    },
  })
  .query('getMany', {
    input: z.object({
      vendor: z.string().optional(),
      refNo: z.string().optional(),
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
