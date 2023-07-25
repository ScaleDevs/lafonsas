import { useState } from 'react';
import Head from 'next/head';
import { useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import ModalLoader from '@/components/ModalLoader';
import Notification from '@/components/Notification';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import IconComp from '@/components/Icon';
import FadeIn from '@/components/FadeIn';
import SelectField from '@/components/SelectField';

const schema = z.object({
  vendor: z.string().min(1, 'Required!'),
  date: z.string().min(1, 'Required!'),
  invoiceRefNo: z.string().min(1, 'Required!'),
  amount: z.number().min(1, 'Required!'),
  entries: z.array(
    z.object({
      date: z.string().min(1, 'Required!'),
      accountId: z.string().min(1, 'Required!'),
      amount: z.number().min(1, 'Required!'),
      description: z.string().min(1, 'Required!'),
    }),
  ),
});

type FormSchemaType = z.infer<typeof schema>;

export default function CreateBill() {
  const [error, setError] = useState('');
  const { mutate, isLoading, isSuccess, isError, error: errs } = trpc.useMutation('bill.create');
  const { data, isLoading: getAccountLoader } = trpc.useQuery(['account.getMany', { limit: 2000, page: 1 }]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: 'entries',
    control,
    rules: {
      required: 'Please add an entry',
    },
  });
  const createBill = (formData: FormSchemaType) => {
    let entryTotal = 0;

    formData.entries.map((entry) => {
      entryTotal += entry.amount;
    });

    if (entryTotal !== formData.amount) {
      setError('Entries Total does not match Bill Amount!');
      return;
    }

    if (error !== '') setError('');

    const billData = {
      vendor: formData.vendor,
      date: formData.date,
      invoiceRefNo: formData.invoiceRefNo,
      amount: formData.amount,
    };

    mutate(
      {
        billData,
        expenses: formData.entries,
      },
      {
        onSuccess() {
          reset();
        },
        onError(err) {
          console.log(err);
        },
      },
    );
  };

  return (
    <Layout>
      <Head>
        <title>Bill | Create</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ModalLoader open={isLoading}>Saving Bill ...</ModalLoader>
      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>Create Bill</h1>
      <br />
      <form
        className='flex flex-col space-y-4 md:w-[100%] bg-white p-8 rounded-md shadow-md overflow-hidden'
        onSubmit={handleSubmit(createBill)}
      >
        {isSuccess && !error ? <Notification rounded='sm' type='success' message='Bill Saved' /> : ''}
        {isError ? <Notification rounded='sm' type='error' message={errs.message} /> : ''}
        {!!error ? <Notification rounded='sm' type='error' message={error} /> : ''}
        <TextField
          required
          label='Vendor'
          placeholder='enter vendor here'
          formInput={{ register, property: 'vendor' }}
          errorMessage={errors.vendor?.message}
        />

        <TextField
          required
          type='date'
          label='Date'
          formInput={{ register, property: 'date' }}
          errorMessage={errors.date?.message}
        />

        <TextField
          required
          label='Reference Number'
          placeholder='enter reference number here'
          formInput={{ register, property: 'invoiceRefNo' }}
          errorMessage={errors.invoiceRefNo?.message}
        />

        <TextField
          required
          type='number'
          label='Bill Amount'
          placeholder='enter bill amount here'
          formInput={{ register, property: 'amount' }}
          errorMessage={errors.amount?.message}
        />

        <div>
          <h1 className='text-md md:text-lg font-semibold font-raleway'>
            Expenses : <span className='text-red-500'>*</span>
          </h1>
          {errors.entries?.message ? <FadeIn cssText='font-raleway text-red-500'>{errors.entries?.message}</FadeIn> : ''}
          <div className='space-y-3'>
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mt-2 w-full bg-zinc-300 p-3 rounded-sm'
                >
                  <TextField
                    required
                    type='date'
                    label='Date'
                    formInput={{ register, property: `entries.${index}.date` }}
                    errorMessage={errors?.entries ? errors.entries[index]?.date?.message : undefined}
                  />

                  <SelectField
                    required
                    label='Account'
                    options={
                      data?.records.map((account) => {
                        return { label: account.accountName, value: account.accountId };
                      }) || []
                    }
                    formInput={{ setValue, property: `entries.${index}.accountId` }}
                    isLoading={getAccountLoader}
                    defaultValue={''}
                    errorMessage={errors?.entries ? errors.entries[index]?.accountId?.message : undefined}
                  />

                  <TextField
                    label='Description'
                    type='text'
                    placeholder='enter description here'
                    formInput={{ register, property: `entries.${index}.description` }}
                    errorMessage={errors?.entries ? errors.entries[index]?.description?.message : undefined}
                  />

                  <TextField
                    label='Amount'
                    labelCss='text-sm font-bold'
                    type='number'
                    placeholder='enter amount here'
                    formInput={{ register, property: `entries.${index}.amount` }}
                    errorMessage={errors?.entries ? errors.entries[index]?.amount?.message : undefined}
                  />
                  <button
                    type='button'
                    className='group flex flex-row items-center justify-center border border-red-500 hover:bg-red-500 px-3 rounded-md transition-colors duration-200 w-[100%] md:w-16 h-16 lg:h-[100%]'
                    onClick={() => remove(index)}
                  >
                    <IconComp iconName='TrashIcon' iconProps={{ fillColor: 'text-red-500 group-hover:text-white' }} />
                  </button>
                </div>
              );
            })}
          </div>
          <button
            type='button'
            className='bg-primary text-white rounded-sm py-1 px-5 text-md mt-3 text-xl font-raleway font-semibold'
            onClick={() => append({ date: '', amount: 0, description: '', accountId: '' })}
          >
            +
          </button>
        </div>

        <br />

        <Button buttonTitle='SUBMIT' type='submit' />
      </form>
    </Layout>
  );
}
