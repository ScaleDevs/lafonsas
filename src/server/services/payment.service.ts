import dayjs from 'dayjs';
import { IPayment } from '@/utils/types';
import { PaymentRepository, IFindPaymentsInput } from '@/repo/payment.repo';
import { DeliveryRepository } from '@/repo/delivery.repo';
import { TRPCError } from '@trpc/server';

class Service {
  public async createPayment(paymentData: Omit<IPayment, 'paymentId'>, deliveryIds: string[]) {
    try {
      const result = await PaymentRepository.createPayment(paymentData);

      for (const delveryId of deliveryIds) await DeliveryRepository.updateDelivery(delveryId, { paymentId: result.paymentId });

      return result;
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findPaymentById(paymentId: string) {
    try {
      return PaymentRepository.findPaymentById(paymentId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findPayments(inputs: IFindPaymentsInput) {
    try {
      const paymentsResult = await PaymentRepository.findPayments(inputs);
      const payments = [];

      for (const payment of paymentsResult.records) {
        const deliveries = await DeliveryRepository.findDeliveriesByPaymentId(payment.paymentId);

        payments.push({
          ...payment,
          deliveries,
        });
      }

      return {
        pageCount: paymentsResult.pageCount,
        records: payments,
      };
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async updatePayment(paymentId: string, paymentPartialData: Partial<IPayment>) {
    try {
      return PaymentRepository.updatePayment(paymentId, {
        ...paymentPartialData,
        checkDate: paymentPartialData.checkDate ? dayjs.tz(paymentPartialData.checkDate).toISOString() : undefined,
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async removeDeliveryFromPayment(deliveryId: string) {
    try {
      return DeliveryRepository.updateDelivery(deliveryId, { paymentId: null });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async addDeliveryFromPayment(deliveryId: string, paymentId: string) {
    try {
      return DeliveryRepository.updateDelivery(deliveryId, { paymentId });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async deletePayment(paymentId: string) {
    try {
      return PaymentRepository.deletePayment(paymentId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }
}

export const PaymentService = new Service();
