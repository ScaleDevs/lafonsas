import prisma from './prisma.client';
import { IDelivery, IPaginationInputs } from '@/utils/types';

export type IFindDeliveriesInput = {
  store?: string;
  startDate: Date;
  endDate: Date;
} & IPaginationInputs;

class Respository {
  public async createDelivery(deliveryData: Omit<IDelivery, 'id'>) {
    return prisma.delivery.create({
      data: {
        ...deliveryData,
      },
    });
  }

  public async findDeliveryById(deliveryId: string) {
    return prisma.delivery.findFirst({ where: { id: deliveryId } });
  }

  public async findDeliveryByDeliveryNumber(deliveryNumber: string) {
    return prisma.delivery.findUnique({ where: { deliveryNumber } });
  }

  public async findDeliveries({ startDate, endDate, store, page, limit }: IFindDeliveriesInput) {
    const whereFilter = {
      postingDate: {
        gte: startDate,
        lte: endDate,
      },
      store,
    };

    const result = await prisma.delivery.findMany({
      where: whereFilter,
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
    });

    const totalCount = await prisma.delivery.count({ where: whereFilter });

    return {
      totalCount,
      records: result,
    };
  }
}

export const DeliveryRepository = new Respository();
