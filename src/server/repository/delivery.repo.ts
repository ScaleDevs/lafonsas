import prisma from './prisma.client';
import { IDelivery, IPaginationInputs } from '@/utils/types';

export type IFindDeliveriesInput = {
  productType?: string;
  storeId?: string;
  startDate: Date | string;
  endDate: Date | string;
} & IPaginationInputs;

class Respository {
  public async createDelivery(deliveryData: Omit<IDelivery, 'id'>) {
    return prisma.delivery.create({
      data: {
        ...deliveryData,
        counterNumber: deliveryData.counterNumber,
      },
    });
  }

  public async findDeliveryById(deliveryId: string) {
    return prisma.delivery.findFirst({ where: { id: deliveryId } });
  }

  public async findDeliveryByDeliveryNumber(deliveryNumber: string) {
    return prisma.delivery.findUnique({
      where: { deliveryNumber },
    });
  }

  public async findDeliveryByDeliveryNumberPartial(deliveryNumber: string) {
    return prisma.delivery.findUnique({
      where: { deliveryNumber },
      select: {
        id: true,
        storeId: true,
        deliveryNumber: true,
        postingDate: true,
        amount: true,
        paymentId: true,
        store: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  public async findDeliveries({
    startDate,
    endDate,
    storeId,
    productType,
    page,
    limit,
    noLimit,
  }: IFindDeliveriesInput) {
    const whereFilter = {
      postingDate: {
        gte: startDate,
        lte: endDate,
      },
      storeId,
      productType,
    };

    const [result, totalCount] = await Promise.all([
      prisma.delivery.findMany({
        where: whereFilter,
        orderBy: { postingDate: 'asc' },
        skip: page > 0 ? (page - 1) * limit : 0,
        take: !!noLimit ? undefined : limit,
        distinct: ['id'],
        select: {
          id: true,
          storeId: true,
          deliveryNumber: true,
          postingDate: true,
          amount: true,
          paymentId: true,
          store: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.delivery.count({ where: whereFilter }),
    ]);

    return {
      pageCount: Math.ceil(totalCount / limit),
      totalCount,
      records: result,
    };
  }

  public async findDeliveriesByStoreId(storeId: string) {
    const result = await prisma.delivery.findMany({
      where: {
        storeId,
        OR: [{ paymentId: null }, { paymentId: { isSet: false } }],
      },
      orderBy: { postingDate: 'desc' },
      select: {
        id: true,
        postingDate: true,
        deliveryNumber: true,
        amount: true,
      },
    });

    return result;
  }

  public async findDeliveriesByStoreIds(storeIds: string[]) {
    const result = await prisma.delivery.findMany({
      where: {
        storeId: {
          in: storeIds,
        },
        OR: [{ paymentId: null }, { paymentId: { isSet: false } }],
      },
      orderBy: { postingDate: 'desc' },
      select: {
        id: true,
        postingDate: true,
        deliveryNumber: true,
        amount: true,
      },
    });

    return result;
  }

  public async findDeliveriesByPaymentId(paymentId: string) {
    const result = await prisma.delivery.findMany({
      where: {
        paymentId,
      },
      select: {
        id: true,
        storeId: true,
        deliveryNumber: true,
        amount: true,
        postingDate: true,
      },
    });

    return result;
  }

  public async updateDelivery(
    deliveryId: string,
    deliveryPartialData: Partial<IDelivery>,
  ) {
    return prisma.delivery.update({
      where: {
        id: deliveryId,
      },
      data: deliveryPartialData,
    });
  }

  public async deleteDelivery(deliveryId: string) {
    return prisma.delivery.delete({
      where: {
        id: deliveryId,
      },
    });
  }
}

export const DeliveryRepository = new Respository();
