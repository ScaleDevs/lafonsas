import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';
import OutsideClickHandler from 'react-outside-click-handler';

import { Overlay } from '@/components/Overlay';
import TextField from '@/components/TextField';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/utils/trpc';
import SelectField from '@/components/SelectField';

const schema = z.object({
  accountId: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
});

export type FormSchemaType = z.infer<typeof schema>;

export interface IListFilterProps {
  isOpen: boolean;
  closeModal: () => void;
  stateFilters: FormSchemaType;
  setStateFilters: Dispatch<SetStateAction<FormSchemaType>>;
  setAccountName: Dispatch<SetStateAction<string>>;
  handlePageChange: (page: number) => void;
}

export default function ListFilter({
  isOpen,
  closeModal,
  stateFilters,
  setStateFilters,
  setAccountName,
  handlePageChange,
}: IListFilterProps) {
  const { data: accountsData, isLoading: getAccountLoader } = trpc.useQuery(['account.getMany', { limit: 2000, page: 1 }]);

  const { handleSubmit, register, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...stateFilters,
    },
  });

  const onSearch = (formData: FormSchemaType) => {
    const { accountId } = formData;
    setStateFilters({
      ...formData,
      accountId: accountId === '' ? undefined : accountId,
    });

    const accountName = accountsData?.records.find((entry) => accountId === entry.accountId)?.accountName || 'ALL ACCOUNTS';

    setAccountName(accountName);

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
            <SelectField
              required
              label='Account'
              options={
                accountsData?.records.map((account) => {
                  return { label: account.accountName, value: account.accountId };
                }) || []
              }
              control={control}
              property='accountId'
              isLoading={getAccountLoader}
            />

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
