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
import Checkbox from '@/components/Checkbox';
import SelectField from '@/components/SelectField';

const baseSchema = (
  isParentStore: z.ZodLiteral<true | false>,
  childStores: z.ZodArray<z.ZodObject<{ id: z.ZodString }>, 'many'>,
  products: z.ZodArray<
    z.ZodObject<
      {
        size: z.ZodString;
        price: z.ZodNumber;
      },
      'strip',
      z.ZodTypeAny,
      {
        size: string;
        price: number;
      },
      {
        size: string;
        price: number;
      }
    >,
    'many'
  >,
) =>
  z.object({
    name: z.string().min(1, 'Please input store name!'),
    isParentStore,
    childStores,
    products,
  });

const schema = z.discriminatedUnion('isParentStore', [
  baseSchema(
    z.literal(true),
    z
      .array(
        z.object({
          id: z.string().min(1, 'Required'),
        }),
      )
      .min(1, 'Required'),
    z.array(
      z.object({
        size: z.string().min(1, 'Please input size!'),
        price: z.number({ invalid_type_error: 'Must input a price!' }).min(1, 'Please input price!'),
      }),
    ),
  ),
  baseSchema(
    z.literal(false),
    z.array(
      z.object({
        id: z.string().min(1, 'Required'),
      }),
    ),
    z
      .array(
        z.object({
          size: z.string().min(1, 'Please input size!'),
          price: z.number({ invalid_type_error: 'Must input a price!' }).min(1, 'Please input price!'),
        }),
      )
      .min(1, 'Please add a product!'),
  ),
]);

type FormSchemaType = z.infer<typeof schema>;

export default function CreateStore() {
  const { mutate, isLoading, isSuccess, isError } = trpc.useMutation('store.create');
  const { data: stores } = trpc.useQuery(['store.getStores', { limit: 1000 }]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      isParentStore: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'products',
    control,
    rules: {
      required: 'Please add a product',
    },
  });

  const {
    fields: childStoreFields,
    append: childStoreAppend,
    remove: childStoreRemove,
  } = useFieldArray({
    name: 'childStores',
    control,
    rules: {
      required: 'Please link a store',
    },
  });

  const createStore = (formData: FormSchemaType) => {
    mutate(
      {
        name: formData.name,
        isParent: formData.isParentStore,
        childStores: formData.childStores.map((v) => v.id),
        products: formData.products,
      },
      {
        onSuccess() {
          reset({
            name: '',
            products: [],
          });
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
        <title>Store | Create</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ModalLoader open={isLoading}>Saving Product ...</ModalLoader>
      <h1 className='font-comfortaa text-3xl font-bold md:text-4xl'>Create Product</h1>
      <br />
      <form
        className='flex flex-col space-y-4 rounded-md bg-white p-8 shadow-md md:w-[100%] xl:w-[60%] 2xl:w-[800px]'
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

        <Checkbox control={control} name='isParentStore' />

        {!watch('isParentStore') && (
          <div>
            <h1 className='text-md font-raleway font-semibold md:text-lg'>
              Products : <span className='text-red-500'>*</span>
            </h1>
            {errors.products?.message ? <FadeIn cssText='font-raleway text-red-500'>{errors.products?.message}</FadeIn> : ''}
            <div className='space-y-3'>
              {fields.map((field, index) => {
                return (
                  <div key={field.id} className='flex items-end gap-2'>
                    <div className='relative mt-2 flex w-[90%] flex-col gap-3 xs:flex-row'>
                      <div className='w-[100%] xs:w-[47%] lg:w-1/2'>
                        <TextField
                          label='Size'
                          labelCss='text-sm font-bold'
                          type='text'
                          placeholder='Product size here'
                          formInput={{ register, property: `products.${index}.size` }}
                          errorMessage={errors?.products ? errors.products[index]?.size?.message : undefined}
                          color='secondary'
                        />
                      </div>
                      <div className='w-[100%] xs:w-[47%] lg:w-1/2'>
                        <TextField
                          label='Price'
                          labelCss='text-sm font-bold'
                          type='number'
                          placeholder='Product price here'
                          formInput={{ register, property: `products.${index}.price` }}
                          errorMessage={errors?.products ? errors.products[index]?.price?.message : undefined}
                          color='secondary'
                        />
                      </div>
                    </div>
                    <button
                      type='button'
                      className='group flex h-[46px] flex-row items-center justify-center rounded-md border border-red-500 px-3 transition-colors duration-200 hover:bg-red-500'
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
              className='text-md mt-3 rounded-sm bg-primary px-5 py-1 font-raleway text-xl font-semibold text-white'
              onClick={() => append({ size: '', price: 0 })}
            >
              +
            </button>
          </div>
        )}

        {!!watch('isParentStore') && (
          <div>
            <h1 className='text-md font-raleway font-semibold md:text-lg'>
              Link Stores : <span className='text-red-500'>*</span>
            </h1>
            {errors.childStores?.message ? (
              <FadeIn cssText='font-raleway text-red-500'>{errors.childStores?.message}</FadeIn>
            ) : (
              ''
            )}
            <div className='space-y-3'>
              {childStoreFields.map((field, index) => {
                return (
                  <div key={field.id} className='mt-2'>
                    <label className='text-md font-roboto font-normal md:text-lg'>
                      Store <span className='text-red-500'>*</span>
                    </label>
                    <div className='mt-2 flex w-full flex-row gap-3'>
                      <div className='w-[90%] md:w-[50%]'>
                        <SelectField
                          required
                          options={
                            stores?.records
                              .filter((store) => {
                                if (!!store.isParent || !!store.parentStore) return false;

                                return !watch('childStores').some((s) => s.id === store.id);
                              })
                              .map((store: any) => {
                                return { label: store.name, value: store.id };
                              }) || []
                          }
                          control={control}
                          property={`childStores.${index}.id`}
                          isLoading={isLoading}
                        />
                      </div>

                      <button
                        type='button'
                        className='group flex flex-row items-center justify-center rounded-md border border-red-500 px-3 transition-colors duration-200 hover:bg-red-500'
                        onClick={() => childStoreRemove(index)}
                      >
                        <IconComp iconName='TrashIcon' iconProps={{ fillColor: 'text-red-500 group-hover:text-white' }} />
                      </button>
                    </div>
                    {!!errors?.childStores ? (
                      <FadeIn cssText='text-red-500'>{errors.childStores[index]?.id?.message}</FadeIn>
                    ) : (
                      ''
                    )}
                  </div>
                );
              })}
            </div>
            <button
              type='button'
              className='text-md mt-3 rounded-sm bg-primary px-5 py-1 font-raleway text-xl font-semibold text-white'
              onClick={() => childStoreAppend({ id: '' })}
            >
              +
            </button>
          </div>
        )}

        <div className='w-[8rem]'>
          <Button buttonTitle='SUBMIT' type='submit' size='sm' />
        </div>
      </form>
    </Layout>
  );
}
