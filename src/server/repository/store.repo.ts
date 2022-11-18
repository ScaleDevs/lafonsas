import prisma from './prisma.client';
import { IStore, IPaginationInputs } from '@/utils/types';

export type IFindStoresInput = {
  storeName?: string;
} & IPaginationInputs;

class Respository {
  public async createStore(storeData: Omit<IStore, 'id'>) {
    return prisma.store.create({
      data: {
        ...storeData,
      },
    });
  }

  public async findStoreById(storeId: string) {
    return prisma.store.findFirst({ where: { id: storeId } });
  }

  public async findStoreByName(storeName: string) {
    return prisma.store.findUnique({ where: { name: storeName } });
  }

  public async findStores({ page, limit, storeName }: IFindStoresInput) {
    const whereFilter = {
      name: {
        startsWith: storeName,
      },
    };

    const result = await prisma.store.findMany({
      where: whereFilter,
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
    });

    const totalCount = await prisma.store.count({
      where: whereFilter,
    });

    return {
      pageCount: Math.ceil(totalCount / limit),
      records: result,
    };
  }

  public async updateStore(storeId: string, storePartialData: Partial<IStore>) {
    return prisma.store.update({
      where: {
        id: storeId,
      },
      data: storePartialData,
    });
  }

  public async deleteStore(storeId: string) {
    return prisma.store.delete({
      where: {
        id: storeId,
      },
    });
  }
}

export const StoreRepository = new Respository();
