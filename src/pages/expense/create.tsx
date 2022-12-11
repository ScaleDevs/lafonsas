import * as React from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import ModalLoader from '@/components/ModalLoader';
import Notification from '@/components/Notification';
import TextField from '@/components/TextField';

const schema = z.object({
  name: z.string().min(1, 'Please input expense name!'),
  description: z.string().optional(),
  category: z.string().min(1, 'Please input category!'),
  expenseDate: z.string().min(1, 'Please input expense date'),
  amount: z.number().min(1, 'Please input expense amount!'),
});

type FormSchemaType = z.infer<typeof schema>;

export default function CreateExpense() {
  const { mutate, isLoading, isSuccess, isError } = trpc.useMutation('expense.create');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  });

  const createExpense = (formData: FormSchemaType) => {
    const mutateParams = {
      ...formData,
      description: formData.description ? formData.description : null,
    };

    mutate(mutateParams, {
      onSuccess() {
        reset();
      },
      onError(err) {
        console.log(err);
      },
    });
  };

  return (
    <Layout>
      <Head>
        <title>Expense | Create</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ModalLoader open={isLoading}>Saving Product ...</ModalLoader>
      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>Create Expense</h1>
      <br />
      <form
        className='flex flex-col space-y-4 md:w-[100%] xl:w-[60%] 2xl:w-[800px] bg-zinc-900 p-8 rounded-md shadow-md overflow-hidden'
        onSubmit={handleSubmit(createExpense)}
      >
        {isSuccess ? <Notification rounded='sm' type='success' message='Expense Saved' /> : ''}
        {isError ? <Notification rounded='sm' type='error' message='Something went wrong' /> : ''}
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

        <button
          type='submit'
          className='p-3 rounded-sm font-comfortaa transition-colors duration-500 bg-blue-600 hover:bg-blue-400'
        >
          SUBMIT
        </button>
      </form>
    </Layout>
  );
}
