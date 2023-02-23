import { Delivery, Expense, Store } from '@prisma/client';

// models
export type IDelivery = Delivery;

export type IStore = Store;

export type IExpense = Omit<Expense, 'date'> & {
  date: string | Date;
};

// inputs
export type IPaginationInputs = {
  page: number;
  limit: number;
};
