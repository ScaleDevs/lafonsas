import * as React from 'react';
import Head from 'next/head';
import { useForm, useFieldArray } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import ModalLoader from '@/components/ModalLoader';
import Notification from '@/components/Notification';
import TextField from '@/components/TextField';
import IconComp from '@/components/Icon';
import FadeIn from '@/components/FadeIn';
import Button from '@/components/Button';

const schema = z.object({
  name: z.string().min(1, 'Please input store name!'),
  products: z
    .array(
      z.object({
        size: z.string().min(1, 'Please input size!'),
        price: z.number({ invalid_type_error: 'Must input a price!' }).min(1, 'Please input price!'),
      }),
    )
    .min(1, 'Please add a product!'),
});

type FormSchemaType = z.infer<typeof schema>;

export default function CreateStore() {
  const { mutate, isLoading, isSuccess, isError } = trpc.useMutation('store.create');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: 'products',
    control,
    rules: {
      required: 'Please add a product',
    },
  });

  const createStore = (formData: FormSchemaType) => {
    mutate(formData, {
      onSuccess() {
        reset({
          name: '',
          products: [],
        });
      },
      onError(err) {
        console.log(err);
      },
    });
  };

  return (
    <Layout>
      <Head>
        <title>Store | Create</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ModalLoader open={isLoading}>Saving Product ...</ModalLoader>
      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>Create Product</h1>
      <br />
      <form
        className='flex flex-col space-y-4 md:w-[100%] xl:w-[60%] 2xl:w-[800px] bg-white p-8 rounded-md shadow-md overflow-hidden'
        onSubmit={handleSubmit(createStore)}
      >
        {isSuccess ? <Notification rounded='sm' type='success' message='Store Saved' /> : ''}
        {isError ? <Notification rounded='sm' type='error' message='Something went wrong' /> : ''}
        <TextField
          required
          label='Store Name'
          placeholder='enter store name here'
          formInput={{ register, property: 'name' }}
          errorMessage={errors.name?.message}
          color='secondary'
        />

        <div>
          <h1 className='text-md md:text-lg font-semibold font-raleway'>
            Products : <span className='text-red-500'>*</span>
          </h1>
          {errors.products?.message ? <FadeIn cssText='font-raleway text-red-500'>{errors.products?.message}</FadeIn> : ''}
          <div className='space-y-3'>
            {fields.map((field, index) => {
              return (
                <div key={field.id} className='grid grid-rows-3 md:grid-rows-1 grid-flow-col gap-3 mt-2 w-full'>
                  <TextField
                    label='Size'
                    labelCss='text-sm font-bold'
                    type='text'
                    placeholder='Product size here'
                    formInput={{ register, property: `products.${index}.size` }}
                    errorMessage={errors?.products ? errors.products[index]?.size?.message : undefined}
                    color='secondary'
                  />
                  <TextField
                    label='Price'
                    labelCss='text-sm font-bold'
                    type='number'
                    placeholder='Product price here'
                    formInput={{ register, property: `products.${index}.price` }}
                    errorMessage={errors?.products ? errors.products[index]?.price?.message : undefined}
                    color='secondary'
                  />
                  <button
                    type='button'
                    className='group flex flex-row items-center justify-center border border-red-500 hover:bg-red-500 px-3 rounded-md transition-colors duration-200'
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
            onClick={() => append({ size: '', price: 0 })}
          >
            +
          </button>
        </div>
        <Button buttonTitle='SUBMIT' type='submit' />
      </form>
    </Layout>
  );
}
