import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { AccountService } from '@/server/services/account.service';

export const accountRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('create', {
    input: z.object({
      accountName: z.string(),
    }),
    resolve({ input }) {
      return AccountService.createAccount(input);
    },
  })
  .mutation('update', {
    input: z.object({
      accountId: z.string(),
      partialData: z.object({
        accountName: z.string().optional(),
      }),
    }),
    resolve({ input }) {
      return AccountService.updateAccount(input.accountId, input.partialData);
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve({ input }) {
      return AccountService.deleteAccount(input);
    },
  })
  .query('getById', {
    input: z.string(),
    resolve({ input }) {
      return AccountService.findAccountById(input);
    },
  })
  .query('getMany', {
    input: z.object({
      accountName: z.string().optional(),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
    }),
    async resolve({ input }) {
      return AccountService.findAccounts({
        ...input,
      });
    },
  });
