import { IStore } from '@/utils/types';
import { IFindStoresInput, StoreRepository } from '@/server/repository/store.repo';
import { TRPCError } from '@trpc/server';
import prisma from '../repository/prisma.client';

class Service {
  public async createStore(storeData: Omit<IStore, 'id' | 'parentStore'> & { childStores?: string[] }) {
    const { childStores, ...rest } = storeData;

    try {
      const parent = await StoreRepository.createStore(rest);

      if (!!childStores && childStores.length > 0)
        for (const child of childStores) {
          const childStore = await StoreRepository.findStoreById(child);
          if (!!childStore && !childStore.parentStore) await StoreRepository.updateStore(child, { parentStore: parent.id });
        }

      return parent;
    } catch (err) {
      console.log(err);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findStoreById(storeId: string) {
    try {
      return StoreRepository.findStoreById(storeId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findStoreByName(storeName: string) {
    try {
      return StoreRepository.findStoreByName(storeName);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findStores(inputs: IFindStoresInput) {
    try {
      return StoreRepository.findStores(inputs);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async updateStore(storeId: string, storePartialData: Partial<IStore>) {
    try {
      console.log('updateStore - SERVICE');
      return StoreRepository.updateStore(storeId, storePartialData);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async deleteStore(storeId: string) {
    try {
      await prisma.store.updateMany({
        where: {
          parentStore: storeId,
        },
        data: {
          parentStore: {
            unset: true,
          },
        },
      });

      return StoreRepository.deleteStore(storeId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }
}

export const StoreService = new Service();
