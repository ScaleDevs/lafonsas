import prisma from './prisma.client';
import { IStore, IPaginationInputs } from '@/utils/types';

export type IFindStoresInput = {
  storeName?: string;
  parentStoreId?: string;
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

  public async findStores({
    page,
    limit,
    storeName,
    parentStoreId,
  }: IFindStoresInput) {
    const whereFilter = {
      name: {
        startsWith: storeName,
      },
      parentStore: parentStoreId
        ? {
            equals: parentStoreId,
          }
        : undefined,
    };

    const result = await prisma.store.findMany({
      where: whereFilter,
      orderBy: { name: 'asc' },
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
      select: {
        isParent: true,
        id: true,
        name: true,
        parentStore: true,
      },
    });

    const totalCount = await prisma.store.count({
      where: whereFilter,
    });

    return {
      pageCount: Math.ceil(totalCount / limit),
      records: result,
    };
  }

  public async findStoresByParentId(parentId: string) {
    const result = await prisma.store.findMany({
      where: {
        parentStore: parentId,
      },
      select: {
        id: true,
      },
    });

    return result;
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
