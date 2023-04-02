import { IAccount } from '@/utils/types';
import { AccountRepository, IFindAccountsInput } from '@/repo/account.repo';
import { TRPCError } from '@trpc/server';

class Service {
  public async createAccount(accountData: Omit<IAccount, 'accountId'>) {
    try {
      return AccountRepository.createAccount({
        accountName: accountData.accountName.toLowerCase().trim(),
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findAccountById(accountId: string) {
    try {
      return AccountRepository.findAccountById(accountId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async findAccounts(params: IFindAccountsInput) {
    try {
      return AccountRepository.findAccounts(params);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async updateAccount(accountId: string, partialData: Partial<IAccount>) {
    try {
      return AccountRepository.updateAccount(accountId, partialData);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }

  public async deleteAccount(accountId: string) {
    try {
      return AccountRepository.deleteAccount(accountId);
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }
}

export const AccountService = new Service();
