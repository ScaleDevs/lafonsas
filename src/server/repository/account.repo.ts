import { Prisma } from '@prisma/client';
import prisma from './prisma.client';
import { IAccount, IPaginationInputs } from '@/utils/types';

export type IFindAccountsInput = {
  accountName?: string;
} & IPaginationInputs;

class Respository {
  public async createAccount(AccountData: Omit<IAccount, 'accountId'>) {
    return prisma.account.create({
      data: {
        ...AccountData,
      },
    });
  }

  public async findAccountById(accountId: string) {
    return prisma.account.findFirst({ where: { accountId } });
  }

  public async findAccounts({ accountName, page, limit }: IFindAccountsInput) {
    const whereFilter: Prisma.AccountWhereInput = {};

    if (!!accountName)
      whereFilter['accountName'] = {
        contains: accountName,
      };

    const result = await prisma.account.findMany({
      where: whereFilter,
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
    });

    const totalCount = await prisma.account.count({ where: whereFilter });

    return {
      pageCount: Math.ceil(totalCount / limit),
      records: result,
    };
  }

  public async updateAccount(accountId: string, accountPartialData: Partial<IAccount>) {
    return prisma.account.update({
      where: {
        accountId,
      },
      data: accountPartialData,
    });
  }

  public async deleteAccount(accountId: string) {
    return prisma.account.delete({
      where: {
        accountId,
      },
    });
  }
}

export const AccountRepository = new Respository();
