import { useState } from 'react';
import dayjs from 'dayjs';
import OutsideClickHandler from 'react-outside-click-handler';

import { trpc } from '@/utils/trpc';
import { Overlay } from '@/components/Overlay';
import SelectField from '@/components/SelectField';
import TextField from '@/components/TextField';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

export interface OnDeliverySearchParams {
  date1: string;
  date2: string;
  storeId?: string;
  productType?: string;
  dr?: string;
}

export interface IListDeliveryFilterProps {
  closeModal: () => void;
  startDate: string;
  endDate: string;
  store?: string;
  deliveryNumber?: string;
  currentProductType?: string;
  onSearch: (data: OnDeliverySearchParams) => void;
}

export default function ListDeliveryFilter({
  onSearch,
  closeModal,
  startDate,
  endDate,
  store,
  deliveryNumber,
  currentProductType,
}: IListDeliveryFilterProps) {
  const { data, isLoading } = trpc.useQuery([
    'store.getStores',
    { limit: 1000 },
  ]);
  const [date1, setDate1] = useState(startDate);
  const [date2, setDate2] = useState(endDate);
  const [storeId, setStoreId] = useState(!store ? 'ALL' : store);
  const [dr, setDr] = useState(deliveryNumber ? deliveryNumber : undefined);
  const [productType, setProductType] = useState(currentProductType);

  const onSearchClick = () => {
    onSearch({ date1, date2, storeId, dr, productType });
  };

  return (
    <>
      <Overlay />
      <OutsideClickHandler onOutsideClick={closeModal}>
        <Modal w='w-[80%] md: w-[520px]' p='p-8'>
          <h1 className='pb-5 font-raleway text-2xl font-semibold'>
            APPLY FILTERS
          </h1>

          <p className='pb-5 font-raleway text-sm text-gray-300'>
            note: applying delivery number filter will ignore other filters
          </p>

          <TextField
            label='Delivery Number'
            placeholder='delivery number here'
            defaultValue={deliveryNumber}
            onChange={(value) => setDr(value)}
          />

          <br />

          <div className='flex w-full flex-row space-x-3'>
            <TextField
              type='date'
              label='Start Date'
              defaultValue={dayjs(date1).format('YYYY-MM-DD')}
              onChange={(value) => setDate1(value)}
            />
            <div className='mt-6 flex flex-row items-center'>-</div>
            <TextField
              type='date'
              label='End Date'
              defaultValue={dayjs(date2).format('YYYY-MM-DD')}
              onChange={(value) => setDate2(value)}
            />
          </div>

          <br />

          <SelectField
            label='Store'
            property='store'
            options={
              [{ name: 'ALL', id: 'ALL' }, ...(data?.records || [])].map(
                (store: any) => {
                  return { label: store.name, value: store.id };
                },
              ) || []
            }
            defaultValue={storeId}
            onChange={(value) => setStoreId(value)}
            isLoading={isLoading}
          />

          <br />

          <SelectField
            label='Product Type'
            property='productType'
            options={[
              { label: 'masareal', value: 'masareal' },
              { label: 'banana-chips', value: 'banana-chips' },
            ]}
            defaultValue={currentProductType}
            onChange={(value) => setProductType(value)}
            isLoading={isLoading}
          />

          <br />
          <Button buttonTitle='SEARCH' size='sm' onClick={onSearchClick} />
        </Modal>
      </OutsideClickHandler>
    </>
  );
}
