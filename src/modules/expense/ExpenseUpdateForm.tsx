import z from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';

import { IExpense } from '@/utils/types';
import { trpc } from '@/utils/trpc';
import TextField from '@/components/TextField';
import Notification from '@/components/Notification';
import Button from '@/components/Button';
import IconComp from '@/components/Icon';
import FadeIn from '@/components/FadeIn';
import { useState } from 'react';

const schema = z.object({
  vendor: z.string().min(1, 'Please input expense name!'),
  date: z.string().min(1, 'Please input expense name!'),
  invoiceRefNo: z.string().min(1, 'Please input category!'),
  amount: z.number().min(1, 'Please input expense amount!'),
  entries: z.array(
    z.object({
      date: z.string().min(1, 'Required!'),
      account: z.string().min(1, 'Required!'),
      amount: z.number().min(1, 'Required!'),
      description: z.string().min(1, 'Required!'),
    }),
  ),
});

type FormSchemaType = z.infer<typeof schema>;

export interface IExpenseUpdateProps {
  data: IExpense;
  refetchCalls: any;
  resetIsUpdate: () => void;
}

export default function ExpenseUpdateForm({ data, refetchCalls, resetIsUpdate }: IExpenseUpdateProps) {
  const { mutate, isLoading, isSuccess, isError } = trpc.useMutation('expense.update');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...data,
      date: dayjs(data.date).format('YYYY-MM-DD'),
      entries: data.entries.map((entry) => {
        return {
          ...entry,
          date: dayjs(entry.date).format('YYYY-MM-DD'),
        };
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'entries',
    control,
    rules: {
      required: 'Please add an entry',
    },
  });

  const updateExpense = (formData: FormSchemaType) => {
    let entryTotal = 0;

    formData.entries.map((entry) => {
      entryTotal += entry.amount;
    });

    if (entryTotal !== formData.amount) {
      setError('Entries Total does not match Expense Amount!');
      return;
    }

    if (error !== '') setError('');

    const partialData = { ...formData } as Partial<FormSchemaType>;

    Object.keys(formData).forEach((key) => {
      const keyField = key as keyof FormSchemaType;
      if (!dirtyFields[keyField]) delete partialData[keyField];
    });

    const mutateParams = {
      expenseId: data.expenseId,
      partialData: partialData,
    };

    mutate(mutateParams, {
      onSuccess() {
        reset({
          ...formData,
        });
        refetchCalls();
      },
    });
  };

  return (
    <div className='bg-white shadow-lg px-5 py-7 rounded-md'>
      <div className='py-3 w-16'>
        <Button size='sm' buttonTitle='Back' onClick={resetIsUpdate} font='raleway' />
      </div>

      {isSuccess && !error ? (
        <div className='py-3'>
          <Notification rounded='sm' type='success' message='Expense updated' />
        </div>
      ) : (
        ''
      )}
      {isError || error ? (
        <div className='py-3'>
          <Notification rounded='sm' type='error' message={error || 'Something went wrong'} />
        </div>
      ) : (
        ''
      )}

      <h1 className='text-3xl font-raleway font-semibold'>UPDATE EXPENSE DETAILS</h1>

      <br />

      <form onSubmit={handleSubmit(updateExpense)} className='space-y-5'>
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
          disabled
          required
          label='Reference Number'
          placeholder='enter reference number here'
          formInput={{ register, property: 'invoiceRefNo' }}
          errorMessage={errors.invoiceRefNo?.message}
        />

        <TextField
          required
          type='number'
          label='Expense Amount'
          placeholder='enter expense amount here'
          formInput={{ register, property: 'amount' }}
          errorMessage={errors.amount?.message}
        />

        <div>
          <h1 className='text-md md:text-lg font-semibold font-raleway'>
            Entries : <span className='text-red-500'>*</span>
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

                  <TextField
                    label='Account'
                    type='text'
                    placeholder='enter account her'
                    formInput={{ register, property: `entries.${index}.account` }}
                    errorMessage={errors?.entries ? errors.entries[index]?.account?.message : undefined}
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
            onClick={() => append({ date: '', amount: 0, description: '', account: '' })}
          >
            +
          </button>
        </div>

        <br />

        <Button type='submit' size='md' isLoading={isLoading} />
      </form>
    </div>
  );
}
