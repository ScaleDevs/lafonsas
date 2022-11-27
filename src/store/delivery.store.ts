import create, { StateCreator } from 'zustand';
import { createTrackedSelector } from 'react-tracked';
import { devtools } from 'zustand/middleware';

export type DeliveryStates = {
  deletedDelivery: string | null;

  setDeliveryState: (label: keyof Omit<DeliveryStates, 'setDeliveryState' | 'resetDeliveryState'>, value: any) => void;

  resetDeliveryState: () => void;
};

const initState: Omit<DeliveryStates, 'setDeliveryState' | 'resetDeliveryState'> = {
  deletedDelivery: null,
};

const stateStore = devtools((set) => ({
  ...initState,

  setDeliveryState: (label, value) => set({ [`${label}`]: value }),

  resetDeliveryState: () => set({ ...initState }),
})) as StateCreator<DeliveryStates, [], [], DeliveryStates>;

export const useDeliveryStore = create<DeliveryStates>(stateStore);

const useDeliveryStoreTrack = createTrackedSelector(useDeliveryStore);

export default useDeliveryStoreTrack;
