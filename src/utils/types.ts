import { Delivery, Expense, Store, ExpenseEntry } from '@prisma/client';

// sub types
export type IExpenseEntry = Omit<ExpenseEntry, 'date'> & {
  date: string | Date;
};

// models
export type IDelivery = Delivery;

export type IStore = Store;

export type IExpense = Omit<Expense, 'date' | 'entries'> & {
  date: string | Date;
  entries: IExpenseEntry[];
};

// inputs
export type IPaginationInputs = {
  page: number;
  limit: number;
};
