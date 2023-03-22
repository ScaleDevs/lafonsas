import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';
import OutsideClickHandler from 'react-outside-click-handler';

import { Overlay } from '@/components/Overlay';
import TextField from '@/components/TextField';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  vendor: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
});

export type FormSchemaType = z.infer<typeof schema>;

export interface IListDeliveryFilterProps {
  isOpen: boolean;
  closeModal: () => void;
  stateFilters: FormSchemaType;
  setStateFilters: Dispatch<SetStateAction<FormSchemaType>>;
  handlePageChange: (page: number) => void;
}

export default function ListExpensesFilter({
  isOpen,
  closeModal,
  stateFilters,
  setStateFilters,
  handlePageChange,
}: IListDeliveryFilterProps) {
  const { handleSubmit, register } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...stateFilters,
    },
  });

  const onSearch = (formData: FormSchemaType) => {
    const { vendor } = formData;
    setStateFilters({
      ...formData,
      vendor: vendor === '' ? undefined : vendor,
    });

    handlePageChange(1);
    closeModal();
  };

  if (!isOpen) return <></>;

  return (
    <>
      <Overlay />
      <OutsideClickHandler onOutsideClick={closeModal}>
        <Modal w='w-[80%] md: w-[520px]' p='p-8'>
          <h1 className='pb-5 font-raleway font-semibold text-2xl'>APPLY FILTERS</h1>

          <form onSubmit={handleSubmit(onSearch)} className='space-y-5'>
            <TextField label='Vendor' placeholder='vendor here' formInput={{ register, property: 'vendor' }} />

            <div className='flex flex-row w-full space-x-3'>
              <TextField required type='date' label='From:' formInput={{ register, property: 'startDate' }} />
              <TextField required type='date' label='To:' formInput={{ register, property: 'endDate' }} />
            </div>

            <br />

            <Button type='submit' buttonTitle='SEARCH' size='sm' />
          </form>
        </Modal>
      </OutsideClickHandler>
    </>
  );
}
