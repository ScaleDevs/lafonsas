import { useState } from 'react';
import z from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';

import { IBill } from '@/utils/types';
import { trpc } from '@/utils/trpc';
import TextField from '@/components/TextField';
import Notification from '@/components/Notification';
import Button from '@/components/Button';
import FadeIn from '@/components/FadeIn';
import IconComp from '@/components/Icon';
import SelectField from '@/components/SelectField';

const schema = z.object({
  vendor: z.string().min(1, 'Required!'),
  date: z.string().min(1, 'Required!'),
  invoiceRefNo: z.string().min(1, 'Required!'),
  amount: z.number().min(1, 'Required!'),
  expenses: z.array(
    z.object({
      expenseId: z.string().optional(),
      date: z.string().min(1, 'Required!'),
      accountId: z.string().min(1, 'Required!'),
      amount: z.number().min(1, 'Required!'),
      description: z.string().min(1, 'Required!'),
    }),
  ),
});

type FormSchemaType = z.infer<typeof schema>;

export interface IUpdateProps {
  data: IBill & {
    expenses: {
      accountName: string;
      expenseId: string;
      date: Date;
      amount: number;
      description: string;
      accountId: string;
      billId: string;
    }[];
  };
  refetchCalls: any;
  resetIsUpdate: () => void;
}

export default function UpdateForm({ data, refetchCalls, resetIsUpdate }: IUpdateProps) {
  const { mutate, isLoading, isSuccess, isError } = trpc.useMutation('bill.update');
  const { data: accountsData, isLoading: getAccountLoader } = trpc.useQuery(['account.getMany', { limit: 2000, page: 1 }]);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...data,
      date: dayjs(data.date).format('YYYY-MM-DD'),
      expenses: data.expenses.map((expense) => {
        return {
          expenseId: expense.expenseId,
          accountId: expense.accountId,
          amount: expense.amount,
          description: expense.description,
          date: dayjs(expense.date).format('YYYY-MM-DD'),
        };
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'expenses',
    control,
    rules: {
      required: 'Please add an entry',
    },
  });

  const updateBill = (formData: FormSchemaType) => {
    let entryTotal = 0;

    formData.expenses.map((expense) => {
      entryTotal += expense.amount;
    });

    if (entryTotal !== formData.amount) {
      setError('Expenses Total does not match Bill Amount!');
      return;
    }

    if (error !== '') setError('');

    const partialData = { ...formData } as Partial<FormSchemaType>;

    Object.keys(formData).forEach((key) => {
      const keyField = key as keyof FormSchemaType;
      if (!dirtyFields[keyField]) delete partialData[keyField];
    });

    const billPartialData = { ...partialData };

    delete billPartialData.expenses;

    const mutateParams = {
      billId: data.billId,
      partialData: billPartialData,
      expenses: partialData.expenses,
    };

    console.log(partialData.expenses);

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
          <Notification rounded='sm' type='success' message='Bill updated' />
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

      <h1 className='text-3xl font-raleway font-semibold'>UPDATE BILL DETAILS</h1>

      <br />

      <form onSubmit={handleSubmit(updateBill)} className='space-y-5'>
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
          label='Bill Amount'
          placeholder='enter bill amount here'
          formInput={{ register, property: 'amount' }}
          errorMessage={errors.amount?.message}
        />

        <br />

        <div>
          <h1 className='text-md md:text-lg font-semibold font-raleway'>
            Expenses : <span className='text-red-500'>*</span>
          </h1>
          {errors.expenses?.message ? <FadeIn cssText='font-raleway text-red-500'>{errors.expenses?.message}</FadeIn> : ''}
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
                    formInput={{ register, property: `expenses.${index}.date` }}
                    errorMessage={errors?.expenses ? errors.expenses[index]?.date?.message : undefined}
                  />

                  <SelectField
                    required
                    label='Account'
                    disabled={!!field.accountId}
                    options={
                      accountsData?.records.map((account) => {
                        return { label: account.accountName, value: account.accountId };
                      }) || []
                    }
                    formInput={{ setValue, property: `expenses.${index}.accountId` }}
                    isLoading={getAccountLoader}
                    defaultValue={field.accountId}
                    errorMessage={errors?.expenses ? errors.expenses[index]?.accountId?.message : undefined}
                  />

                  <TextField
                    label='Description'
                    type='text'
                    placeholder='enter description here'
                    formInput={{ register, property: `expenses.${index}.description` }}
                    errorMessage={errors?.expenses ? errors.expenses[index]?.description?.message : undefined}
                  />

                  <TextField
                    label='Amount'
                    labelCss='text-sm font-bold'
                    type='number'
                    placeholder='enter amount here'
                    formInput={{ register, property: `expenses.${index}.amount` }}
                    errorMessage={errors?.expenses ? errors.expenses[index]?.amount?.message : undefined}
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
            onClick={() => append({ expenseId: '', date: '', amount: 0, description: '', accountId: '' })}
          >
            +
          </button>
        </div>

        <Button type='submit' size='md' isLoading={isLoading} />
      </form>
    </div>
  );
}
