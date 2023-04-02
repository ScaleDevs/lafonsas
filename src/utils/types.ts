import { Delivery, Bill, Expense, Account, Store } from '@prisma/client';

// models
export type IDelivery = Delivery;

export type IStore = Store;

export type IAccount = Account;

export type IBill = Omit<Bill, 'date'> & {
  date: string | Date;
};

export type IExpense = Omit<Expense, 'date'> & {
  date: string | Date;
};

// inputs
export type IPaginationInputs = {
  page: number;
  limit: number;
};
