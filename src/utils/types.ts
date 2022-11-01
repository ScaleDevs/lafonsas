import { Delivery } from '@prisma/client';

// models
export type IDelivery = Delivery;

// inputs
export type IPaginationInputs = {
  page: number;
  limit: number;
};
