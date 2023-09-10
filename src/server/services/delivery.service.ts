import { IDelivery } from '@/utils/types';
import { DeliveryRepository, IFindDeliveriesInput } from '@/server/repository/delivery.repo';
import { TRPCError } from '@trpc/server';

class Service {
  public async createDelivery(deliveryData: Omit<IDelivery, 'id'>) {
    try {
      const isExist = await this.findDeliveryByDeliveryNumber(deliveryData.deliveryNumber);

      if (!!isExist) throw new TRPCError({ code: 'CONFLICT' });

      return DeliveryRepository.createDelivery(deliveryData);
    } catch (err: any) {
      if (err.code === 'CONFLICT') throw new TRPCError({ code: 'CONFLICT', message: 'Delivery number already exist' });
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

  public async findDeliveriesByStoreId(storeId: string) {
    try {
      return DeliveryRepository.findDeliveriesByStoreId(storeId);
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
