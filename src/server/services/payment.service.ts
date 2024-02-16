import dayjs from 'dayjs';
import { TRPCError } from '@trpc/server';
import { IPayment } from '@/utils/types';
import { PaymentRepository, IFindPaymentsInput } from '@/repo/payment.repo';
import { DeliveryRepository } from '@/repo/delivery.repo';
import { StoreRepository } from '@/repo/store.repo';

class Service {
  public async createPayment(paymentData: Omit<IPayment, 'paymentId'>, deliveryIds: string[]) {
    try {
      const result = await PaymentRepository.createPayment(paymentData);

      for (const delveryId of deliveryIds) await DeliveryRepository.updateDelivery(delveryId, { paymentId: result.paymentId });

      return result;
    } catch (err) {
      console.log(err);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findPayment({ paymentId, refNo }: { paymentId?: string; refNo?: string }) {
    try {
      if (!paymentId && !refNo) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No ID Provided' });

      let payment: IPayment | null = null;

      if (paymentId) payment = await PaymentRepository.findPaymentById(paymentId);
      if (refNo) payment = await PaymentRepository.findPaymentByRefNo(refNo);

      if (!payment) throw new TRPCError({ code: 'NOT_FOUND', message: 'PAYMENT RECORD NOT FOUND' });

      const [deliveries, store] = await Promise.all([
        DeliveryRepository.findDeliveriesByPaymentId(payment.paymentId),
        StoreRepository.findStoreById(payment.storeId),
      ]);

      return {
        ...payment,
        vendorName: store?.name ?? '',
        deliveries,
      };
    } catch (err: any) {
      throw new TRPCError({ code: err.code || 'INTERNAL_SERVER_ERROR', message: err.message || 'Something went wrong' });
    }
  }

  public async findPayments(inputs: IFindPaymentsInput) {
    try {
      const paymentsResult = await PaymentRepository.findPayments(inputs);
      const payments = [];
      const vendorMap = new Map<string, string>();

      for (const payment of paymentsResult.records) {
        payments.push(
          (async () => {
            let vendorName = vendorMap.get(payment.storeId);

            if (!vendorName) {
              const store = await StoreRepository.findStoreById(payment.storeId);
              if (!!store) {
                vendorMap.set(payment.storeId, store.name);
                vendorName = store.name;
              }
            }

            return {
              ...payment,
              vendor: vendorName ?? 'N/A',
            };
          })(),
        );
      }

      return {
        pageCount: paymentsResult.pageCount,
        records: await Promise.all(payments),
      };
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async updatePayment(paymentId: string, paymentPartialData: Partial<IPayment>) {
    try {
      return PaymentRepository.updatePayment(paymentId, {
        ...paymentPartialData,
        refDate: paymentPartialData.refDate ? dayjs.tz(paymentPartialData.refDate).toISOString() : undefined,
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
      const paymentRecord = await PaymentRepository.findPaymentById(paymentId);

      if (!paymentRecord) throw new TRPCError({ code: 'NOT_FOUND', message: 'Payment Record Not Found!' });

      const deliveries = await DeliveryRepository.findDeliveriesByPaymentId(paymentId);

      for (const delivery of deliveries) await DeliveryRepository.updateDelivery(delivery.id, { paymentId: null });

      return PaymentRepository.deletePayment(paymentId);
    } catch (err: any) {
      throw new TRPCError({ code: err.code || 'INTERNAL_SERVER_ERROR', message: err.message || 'Something went wrong' });
    }
  }
}

export const PaymentService = new Service();
