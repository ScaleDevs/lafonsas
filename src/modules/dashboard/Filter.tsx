import { useState } from 'react';
import useDisclosure from '../hooks/useDisclosure';
import dayjs from 'dayjs';
import OutsideClickHandler from 'react-outside-click-handler';

import { Overlay } from '@/components/Overlay';
import SelectField from '@/components/SelectField';
import TextField from '@/components/TextField';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { trpc } from '@/utils/trpc';

export interface IFilterModalProps {
  onSearch: (data: { date1: string; date2: string; storeId: string }) => void;
  startDate: string;
  endDate: string;
  defaultStoreId?: string;
}

export function FilterModal({ startDate, endDate, defaultStoreId, onSearch }: IFilterModalProps) {
  const { data, isLoading } = trpc.useQuery(['store.getStores', { limit: 1000 }]);

  const { open, toggle } = useDisclosure();
  const [date1, setDate1] = useState(startDate);
  const [date2, setDate2] = useState(endDate);
  const [storeId, setStoreId] = useState(defaultStoreId);

  const onSearchClick = () => {
    if (storeId) onSearch({ date1, date2, storeId });
    toggle();
  };

  return (
    <div>
      <div className='w-[100px]'>
        <Button buttonTitle='Filter' size='sm' onClick={toggle} />
      </div>

      {open && (
        <>
          <Overlay />
          <OutsideClickHandler onOutsideClick={toggle}>
            <Modal w='w-[600px]' p='p-8'>
              <h1 className='pb-5 font-raleway text-2xl font-semibold'>APPLY FILTERS</h1>

              <div className='space-y-3'>
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

                <SelectField
                  label='Store'
                  property='store'
                  options={
                    [{ name: 'ALL', id: 'ALL' }, ...(data?.records || [])].map((store: any) => {
                      return { label: store.name, value: store.id };
                    }) || []
                  }
                  defaultValue={storeId}
                  onChange={(value) => setStoreId(value)}
                  isLoading={isLoading}
                />

                <div className='pt-3'>
                  <Button buttonTitle='SEARCH' size='sm' onClick={onSearchClick} isLoading={isLoading} />
                </div>
              </div>
            </Modal>
          </OutsideClickHandler>
        </>
      )}
    </div>
  );
}
