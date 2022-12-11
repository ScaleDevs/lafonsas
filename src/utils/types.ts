import { Delivery, Expense, Store } from '@prisma/client';

// models
export type IDelivery = Delivery;

export type IStore = Store;

export type IExpense = Expense;

// inputs
export type IPaginationInputs = {
  page: number;
  limit: number;
};
