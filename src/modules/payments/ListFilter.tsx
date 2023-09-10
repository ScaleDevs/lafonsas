import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import OutsideClickHandler from 'react-outside-click-handler';

import { trpc } from '@/utils/trpc';
import { Overlay } from '@/components/Overlay';
import TextField from '@/components/TextField';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import SelectField from '@/components/SelectField';

const schema = z.object({
  refNo: z.string().optional(),
  vendor: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
});

export type PaymentFilterFormSchemaType = z.infer<typeof schema>;

export interface IListFilterProps {
  isOpen: boolean;
  closeModal: () => void;
  stateFilters: PaymentFilterFormSchemaType;
  setStateFilters: Dispatch<SetStateAction<PaymentFilterFormSchemaType>>;
  handlePageChange: (page: number, vendorName?: string) => void;
}

export default function ListFilter({ isOpen, closeModal, stateFilters, setStateFilters, handlePageChange }: IListFilterProps) {
  const { data } = trpc.useQuery(['store.getStores', { limit: 1000 }]);

  const { handleSubmit, register, control, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...stateFilters,
      vendor: 'ALL',
    },
  });

  const onSearch = (formData: PaymentFilterFormSchemaType) => {
    const { vendor } = formData;

    setStateFilters({
      ...formData,
      vendor: vendor === '' || vendor === 'ALL' ? undefined : vendor,
    });

    handlePageChange(1, data?.records.find((v) => v.id === vendor)?.name);
    closeModal();
  };

  if (!isOpen) return <></>;

  return (
    <>
      <Overlay />
      <OutsideClickHandler onOutsideClick={closeModal}>
        <Modal w='w-[80%] md: w-[520px]' p='p-8'>
          <h1 className='pb-5 font-raleway font-semibold text-2xl'>APPLY FILTERS</h1>

          <h2 className='pb-5 font-raleway text-gray-500 font-semibold text-xs'>
            <span className='text-sm font-bold'>Note:</span> When you input "Reference No" field other fields will be disabled
          </h2>

          <form onSubmit={handleSubmit(onSearch)} className='space-y-5'>
            <TextField label='Reference No' formInput={{ register, property: 'refNo' }} />

            <SelectField
              required
              label='Store'
              options={[{ id: 'ALL', name: 'ALL' }, ...(data?.records || [])].map((store: any) => {
                return { label: store.name, value: store.id };
              })}
              control={control}
              property='vendor'
              disabled={!!watch('refNo')}
            />

            <div className='flex flex-row w-full space-x-3'>
              <TextField
                required
                type='date'
                label='From:'
                formInput={{ register, property: 'startDate' }}
                disabled={!!watch('refNo')}
              />
              <TextField
                required
                type='date'
                label='To:'
                formInput={{ register, property: 'endDate' }}
                disabled={!!watch('refNo')}
              />
            </div>

            <br />

            <Button type='submit' buttonTitle='SEARCH' size='sm' />
          </form>
        </Modal>
      </OutsideClickHandler>
    </>
  );
}
