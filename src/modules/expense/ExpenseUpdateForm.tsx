import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import OutsideClickHandler from 'react-outside-click-handler';

import { IExpense } from '@/utils/types';
import { trpc } from '@/utils/trpc';
import Modal from '@/components/Modal';
import { Overlay } from '@/components/Overlay';
import TextField from '@/components/TextField';
import Notification from '@/components/Notification';
import Button from '@/components/Button';

const schema = z.object({
  name: z.string().min(1, 'Please input expense name!'),
  description: z.string().optional(),
  category: z.string().min(1, 'Please input category!'),
  expenseDate: z.string().min(1, 'Please input expense date'),
  amount: z.number().min(1, 'Please input expense amount!'),
});

type FormSchemaType = z.infer<typeof schema>;

export interface IExpenseUpdateProps {
  data: IExpense;
  resetExpenseData: () => void;
  refetchCalls: any;
  resetIsUpdate: () => void;
}

export default function ExpenseUpdateForm({ data, resetExpenseData, refetchCalls, resetIsUpdate }: IExpenseUpdateProps) {
  const { mutate, isLoading, isSuccess, isError } = trpc.useMutation('expense.update');

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...data,
      description: data.description ? data.description : undefined,
      expenseDate: dayjs(data.expenseDate).format('YYYY-MM-DD'),
    },
  });

  const updateExpense = (formData: FormSchemaType) => {
    const partialData = { ...formData } as Partial<FormSchemaType>;

    Object.keys(formData).forEach((key) => {
      const keyField = key as keyof FormSchemaType;
      if (!dirtyFields[keyField]) delete partialData[keyField];
    });

    const mutateParams = {
      expenseId: data.id,
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
    <>
      <Overlay />
      <OutsideClickHandler onOutsideClick={resetExpenseData}>
        <Modal w='w-[80%] md: w-[600px]' p='p-8'>
          <button
            type='button'
            className='absolute top-0 right-0 pr-4 pt-2 hover:text-red-500'
            onClick={() => resetExpenseData()}
          >
            X
          </button>
          <div className='py-3 w-16'>
            <Button size='sm' buttonTitle='Back' onClick={resetIsUpdate} font='raleway' />
          </div>

          {isSuccess ? (
            <div className='py-3'>
              <Notification rounded='sm' type='success' message='Expense updated' />
            </div>
          ) : (
            ''
          )}
          {isError ? (
            <div className='py-3'>
              <Notification rounded='sm' type='error' message='Something went wrong' />
            </div>
          ) : (
            ''
          )}

          <form onSubmit={handleSubmit(updateExpense)}>
            <TextField
              required
              label='Expense Name'
              placeholder='enter expense name here'
              formInput={{ register, property: 'name' }}
              errorMessage={errors.name?.message}
            />

            <TextField
              label='Description'
              placeholder='enter description here'
              formInput={{ register, property: 'description' }}
              errorMessage={errors.description?.message}
            />

            <TextField
              required
              label='Category'
              placeholder='enter description here'
              formInput={{ register, property: 'category' }}
              errorMessage={errors.category?.message}
            />

            <TextField
              required
              type='date'
              label='Expense Date'
              placeholder='enter expense date here'
              formInput={{ register, property: 'expenseDate' }}
              errorMessage={errors.expenseDate?.message}
            />

            <TextField
              required
              type='number'
              label='Expense Amount'
              placeholder='enter expense amount here'
              formInput={{ register, property: 'amount' }}
              errorMessage={errors.amount?.message}
            />

            <br />

            <Button type='submit' size='md' isLoading={isLoading} />
          </form>
        </Modal>
      </OutsideClickHandler>
    </>
  );
}
