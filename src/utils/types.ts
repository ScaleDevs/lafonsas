import { Delivery, Store } from '@prisma/client';

// models
export type IDelivery = Delivery;

export type IStore = Store;

// inputs
export type IPaginationInputs = {
  page: number;
  limit: number;
};
