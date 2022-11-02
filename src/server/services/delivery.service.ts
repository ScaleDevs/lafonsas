import { IDelivery } from '@/utils/types';
import { DeliveryRepository, IFindDeliveriesInput } from '@/server/repository/delivery.repo';
import { TRPCError } from '@trpc/server';

class Service {
  public async createDelivery(deliveryData: Omit<IDelivery, 'id'>) {
    try {
      return DeliveryRepository.createDelivery(deliveryData);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findDeliveryById(deliveryId: string) {
    try {
      return DeliveryRepository.findDeliveryById(deliveryId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findDeliveryByDeliveryNumber(deliveryNumber: string) {
    try {
      return DeliveryRepository.findDeliveryByDeliveryNumber(deliveryNumber);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findDeliveries(inputs: IFindDeliveriesInput) {
    try {
      return DeliveryRepository.findDeliveries(inputs);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async updateDelivery(deliveryId: string, partialData: Partial<IDelivery>) {
    try {
      return DeliveryRepository.updateDelivery(deliveryId, partialData);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async deleteDelivery(deliveryId: string) {
    try {
      return DeliveryRepository.deleteDelivery(deliveryId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }
}

export const DeliveryService = new Service();
