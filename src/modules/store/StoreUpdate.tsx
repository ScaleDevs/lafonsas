import z from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { twMerge } from 'tailwind-merge';

import { IStore } from '@/utils/types';
import { trpc } from '@/utils/trpc';
import TextField from '@/components/TextField';
import FadeIn from '@/components/FadeIn';
import IconComp from '@/components/Icon';
import Notification from '@/components/Notification';
import Button from '@/components/Button';

const schema = z.object({
  name: z.string().min(1, 'Please input store name!'),
  products: z
    .array(
      z.object({
        size: z.string().min(1, 'Please input size!'),
        price: z.preprocess(
          (input) => parseFloat(input as string),
          z
            .number({ invalid_type_error: 'Must input a price!' })
            .min(1, 'Please input price!'),
        ),
      }),
    )
    .min(1, 'Please add a product!'),
});

type FormSchemaType = z.infer<typeof schema>;

export interface IStoreUpdateProps {
  data: IStore;
}

export default function StoreUpdate({ data }: IStoreUpdateProps) {
  const { mutate, isLoading, isSuccess, isError } =
    trpc.useMutation('store.update');

  const ctx = trpc.useContext();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, defaultValues },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data.name,
      products: data.products,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'products',
    control,
    rules: {
      required: 'Please add a product',
    },
  });

  const updateStore = (formData: FormSchemaType) => {
    const partialData = { ...formData } as Partial<FormSchemaType>;

    Object.keys(formData).forEach((key) => {
      const keyField = key as keyof FormSchemaType;
      if (!dirtyFields[keyField]) delete partialData[keyField];
    });

    const mutateParams = {
      storeId: data.id,
      storePartialData: partialData,
    };

    mutate(mutateParams, {
      onSuccess() {
        reset({
          ...formData,
        });
        ctx.setQueryData(['store.getById', data.id], (updater: any) => {
          return {
            ...updater,
            ...formData,
          };
        });
      },
    });
  };

  return (
    <>
      {isSuccess ? (
        <div className='py-3'>
          <Notification rounded='sm' type='success' message='Store updated' />
        </div>
      ) : (
        ''
      )}
      {isError ? (
        <div className='py-3'>
          <Notification
            rounded='sm'
            type='error'
            message='Something went wrong'
          />
        </div>
      ) : (
        ''
      )}

      <form onSubmit={handleSubmit(updateStore)}>
        <TextField
          required
          label='Store Name'
          placeholder='enter store name here'
          defaultValue={defaultValues?.name}
          formInput={{ register, property: 'name' }}
          errorMessage={errors.name?.message}
        />

        <br />

        <div>
          <h1 className='text-md font-raleway font-semibold md:text-lg'>
            Products :
          </h1>
          {errors.products?.message ? (
            <FadeIn cssText='font-raleway text-red-500'>
              {errors.products?.message}
            </FadeIn>
          ) : (
            ''
          )}
          <div className='space-y-3'>
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className={twMerge(
                    'flex',
                    'mt-2 w-full gap-3',
                    'max-[600px]:flex-col',
                  )}
                >
                  <TextField
                    label='Size'
                    labelCss='text-sm font-bold'
                    type='text'
                    placeholder='Product size here'
                    formInput={{ register, property: `products.${index}.size` }}
                    errorMessage={
                      errors?.products
                        ? errors.products[index]?.size?.message
                        : undefined
                    }
                  />
                  <TextField
                    label='Price'
                    labelCss='text-sm font-bold'
                    type='number'
                    placeholder='Product price here'
                    formInput={{
                      register,
                      property: `products.${index}.price`,
                    }}
                    errorMessage={
                      errors?.products
                        ? errors.products[index]?.price?.message
                        : undefined
                    }
                  />
                  <div className='flex items-end'>
                    <button
                      type='button'
                      className={twMerge(
                        'group flex flex-row items-center justify-center',
                        'rounded-md border border-red-500 px-3',
                        'transition-colors duration-200 hover:bg-red-500',
                        'p-3',
                      )}
                      onClick={() => remove(index)}
                    >
                      <IconComp
                        iconName='TrashIcon'
                        iconProps={{
                          fillColor: 'text-red-500 group-hover:text-white',
                        }}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='mt-3 w-16'>
            <Button
              size='sm'
              buttonTitle='+'
              onClick={() => append({ size: '', price: 0 })}
            />
          </div>

          <br />

          <Button type='submit' size='md' isLoading={isLoading} />
        </div>
      </form>
    </>
  );
}
