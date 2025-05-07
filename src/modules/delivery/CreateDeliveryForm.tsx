import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { trpc } from '@/utils/trpc';
import TextField from '@/components/TextField';
import SelectField from '@/components/SelectField';
import Button from '@/components/Button';
import InputArray from '@/modules/delivery/components/InputArray';
import {
  DeliveryFormSchemaType,
  HandleChangeStepParams,
  deliveryFormSchema,
} from './types';

export interface CreateDeliveryFormProps {
  defaultValues: DeliveryFormSchemaType;
  changeStep: (handleChangeStepParams: HandleChangeStepParams) => void;
}

export default function CreateDeliveryForm({
  defaultValues,
  changeStep,
}: CreateDeliveryFormProps) {
  const { data, isLoading } = trpc.useQuery([
    'store.getStores',
    { limit: 1000 },
  ]);
  const [storeId, setStoreId] = useState(
    defaultValues.storeId ? defaultValues.storeId : '',
  );

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
    control,
  } = useForm<DeliveryFormSchemaType>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const {
    fields: orderFields,
    append: addOrder,
    remove: removeOrder,
  } = useFieldArray({
    name: 'orders',
    control,
    rules: {
      required: 'Please add an order!',
    },
  });

  const {
    fields: returnSlipFields,
    append: addReturnSlipItem,
    remove: removeReturnSlipItem,
  } = useFieldArray({
    name: 'returnSlip',
    control,
  });

  const onStoreSelect = (value: string) => {
    setStoreId(value);
    resetField('orders', { defaultValue: [] });
    resetField('returnSlip', { defaultValue: [] });
  };

  const createDelivery = (formData: DeliveryFormSchemaType) => {
    const step1FormData = {
      ...formData,
    };

    changeStep({
      step: 2,
      data: step1FormData,
    });
  };

  return (
    <form
      className='flex flex-col space-y-4 overflow-hidden rounded-md bg-white p-8 text-black shadow-md md:w-[100%]'
      onSubmit={handleSubmit(createDelivery)}
    >
      <h1 className='font-comfortaa text-3xl font-bold md:text-4xl'>
        Create Delivery
      </h1>
      <br />

      <div className='flex flex-col justify-between space-y-5 lg:flex-row lg:space-x-7 lg:space-y-0'>
        <SelectField
          required
          label='Store'
          options={
            data?.records.map((store: any) => {
              return { label: store.name, value: store.id };
            }) || []
          }
          control={control}
          property='storeId'
          errorMessage={errors.storeId?.message}
          onChange={onStoreSelect}
          isLoading={isLoading}
        />

        <TextField
          required
          label='Delivery Number'
          placeholder='enter delivery number here'
          formInput={{ register, property: 'deliveryNumber' }}
          errorMessage={errors.deliveryNumber?.message}
        />

        <TextField
          label='Counter Number'
          placeholder='enter counter number here'
          formInput={{ register, property: 'counterNumber' }}
          errorMessage={errors.deliveryNumber?.message}
        />
      </div>

      <div className='flex flex-col justify-between space-y-5 lg:flex-row lg:space-x-7 lg:space-y-0'>
        <TextField
          required
          type='date'
          label='Posting Date'
          formInput={{ register, property: 'postingDate' }}
          errorMessage={errors.postingDate?.message}
        />

        <SelectField
          required
          label='Product Type'
          options={[
            { label: 'masareal', value: 'masareal' },
            { label: 'banana-chips', value: 'banana-chips' },
          ]}
          control={control}
          property='productType'
          errorMessage={errors.productType?.message}
        />
      </div>

      <InputArray
        label='Orders'
        property='orders'
        register={register}
        control={control}
        storeId={storeId}
        fields={orderFields}
        errors={errors}
        append={addOrder}
        remove={removeOrder}
      />

      <InputArray
        label='Return Slip'
        property='returnSlip'
        register={register}
        control={control}
        storeId={storeId}
        fields={returnSlipFields}
        errors={errors}
        append={addReturnSlipItem}
        remove={removeReturnSlipItem}
      />
      <Button buttonTitle='REVIEW' type='submit' />
    </form>
  );
}
