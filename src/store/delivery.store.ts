import create, { StateCreator } from 'zustand';
import { createTrackedSelector } from 'react-tracked';
import { devtools } from 'zustand/middleware';
import { getEndOfMonth, getStartOfMonth } from '@/utils/helper';

export type DeliveryStates = {
  deletedDelivery: string | null;
  startDate: string;
  endDate: string;
  storeId: string | undefined;
  productType?: string;
  deliveryNumber: string | undefined;
  page: number;

  setDeliveryState: (
    label: keyof Omit<
      DeliveryStates,
      'setDeliveryState' | 'resetDeliveryState'
    >,
    value: any,
  ) => void;
  resetDeliveryState: () => void;
};

const initState: Omit<
  DeliveryStates,
  'setDeliveryState' | 'resetDeliveryState'
> = {
  deletedDelivery: null,
  startDate: getStartOfMonth(),
  endDate: getEndOfMonth(),
  storeId: undefined,
  productType: undefined,
  deliveryNumber: undefined,
  page: 1,
};

const stateStore = devtools((set) => ({
  ...initState,

  setDeliveryState: (label, value) => set({ [`${label}`]: value }),

  resetDeliveryState: () => set({ ...initState }),
})) as StateCreator<DeliveryStates, [], [], DeliveryStates>;

export const useDeliveryStore = create<DeliveryStates>(stateStore);

const useDeliveryStoreTrack = createTrackedSelector(useDeliveryStore);

export default useDeliveryStoreTrack;
