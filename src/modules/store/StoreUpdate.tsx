import z from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import OutsideClickHandler from 'react-outside-click-handler';

import { IStore } from '@/utils/types';
import { trpc } from '@/utils/trpc';
import Modal from '@/components/Modal';
import { Overlay } from '@/components/Overlay';
import InputWrapper from '@/components/InputWrapper';
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
          (input) => parseInt(input as string, 10),
          z.number({ invalid_type_error: 'Must input a price!' }).min(1, 'Please input price!'),
        ),
      }),
    )
    .min(1, 'Please add a product!'),
});

type FormSchemaType = z.infer<typeof schema>;

export interface IStoreUpdateProps {
  data: IStore;
  resetStoreState: () => void;
  storesRefetch: any;
  resetIsUpdate: () => void;
}

export default function StoreUpdate({ resetStoreState, data, storesRefetch, resetIsUpdate }: IStoreUpdateProps) {
  const { mutate, isLoading, isSuccess, isError } = trpc.useMutation('store.update');

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
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
    const paritalData = { ...formData } as Partial<FormSchemaType>;

    Object.keys(formData).forEach((key) => {
      const keyField = key as keyof FormSchemaType;
      if (!dirtyFields[keyField]) delete paritalData[keyField];
    });

    const mutateParams = {
      storeId: data.id,
      storePartialData: paritalData,
    };

    mutate(mutateParams, {
      onSuccess() {
        reset({
          ...formData,
        });
        storesRefetch();
      },
    });
  };

  return (
    <>
      <Overlay />
      <OutsideClickHandler onOutsideClick={resetStoreState}>
        <Modal w='w-[80%] md: w-[600px]' p='p-8'>
          <button type='button' className='absolute top-0 right-0 pr-4 pt-2 hover:text-red-500' onClick={() => resetStoreState()}>
            X
          </button>
          <div className='py-3 w-16'>
            <Button size='sm' buttonTitle='Back' onClick={resetIsUpdate} font='raleway' />
          </div>

          {isSuccess ? (
            <div className='py-3'>
              <Notification rounded='sm' type='success' message='Store updated' />
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

          <form onSubmit={handleSubmit(updateStore)}>
            <InputWrapper
              register={register}
              errorsMsg={errors.name?.message}
              label='Store Name'
              property='name'
              placeholder='enter store name here'
            />

            <br />

            <div>
              <h1 className='text-md md:text-lg font-semibold font-raleway'>Products :</h1>
              {errors.products?.message ? <FadeIn cssText='font-raleway text-red-500'>{errors.products?.message}</FadeIn> : ''}
              <div className='space-y-3'>
                {fields.map((field, index) => {
                  return (
                    <div key={field.id} className='grid grid-rows-3 md:grid-rows-1 grid-flow-col gap-3 mt-2 w-full'>
                      <InputWrapper
                        label='Size'
                        labelCss='text-sm font-bold'
                        register={register}
                        type='text'
                        errorsMsg={errors?.products ? errors.products[index]?.size?.message : undefined}
                        property={`products.${index}.size`}
                        placeholder='Product size here'
                      />
                      <InputWrapper
                        label='Price'
                        labelCss='text-sm font-bold'
                        register={register}
                        type='number'
                        errorsMsg={errors?.products ? errors.products[index]?.price?.message : undefined}
                        property={`products.${index}.price`}
                        placeholder='Product price here'
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
              <div className='mt-3 w-16'>
                <Button size='sm' buttonTitle='+' onClick={() => append({ size: '', price: 0 })} />
              </div>

              <br />

              <Button type='submit' size='md' isLoading={isLoading} />
            </div>
          </form>
        </Modal>
      </OutsideClickHandler>
    </>
  );
}
