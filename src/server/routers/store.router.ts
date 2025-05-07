import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { StoreService } from '@/server/services/store.service';

export const storeRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('create', {
    input: z.object({
      name: z.string().transform((val) => val.toUpperCase()),
      isParent: z.boolean().nullable(),
      parentStore: z.string().nullable(),
      childStores: z.array(z.string()).optional(),
      products: z.array(
        z.object({
          size: z.string(),
          price: z.number(),
        }),
      ),
    }),
    resolve({ input }) {
      return StoreService.createStore(input);
    },
  })
  .mutation('update', {
    input: z.object({
      storeId: z.string(),
      storePartialData: z.object({
        name: z.string().optional(),
        products: z
          .array(
            z.object({
              size: z.string(),
              price: z.number(),
            }),
          )
          .optional(),
      }),
    }),
    resolve({ input }) {
      console.log('updateStore - RESOLVER');
      return StoreService.updateStore(input.storeId, input.storePartialData);
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve({ input }) {
      return StoreService.deleteStore(input);
    },
  })
  .mutation('removeChildStore', {
    input: z.string(),
    resolve({ input }) {
      return StoreService.removeChildStore(input);
    },
  })
  .query('getById', {
    input: z.string(),
    resolve({ input }) {
      if (input === 'ALL') return null;
      return StoreService.findStoreById(input);
    },
  })
  .query('getStoreByName', {
    input: z.string(),
    resolve({ input }) {
      return StoreService.findStoreByName(input);
    },
  })
  .query('getStores', {
    input: z.object({
      storeName: z.string().min(3).optional(),
      parentStoreId: z.string().optional(),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
    }),
    resolve({ input }) {
      return StoreService.findStores(input);
    },
  });
