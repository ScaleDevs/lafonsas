import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { trpc } from '@/utils/trpc';
import TextField from '@/components/TextField';
import SelectField from '@/components/SelectField';
import Button from '@/components/Button';
import InputArray from '@/modules/delivery/components/InputArray';
import { DeliveryFormSchemaType, HandleChangeStepParams, deliveryFormSchema } from './types';

export interface CreateDeliveryFormProps {
  defaultValues: DeliveryFormSchemaType;
  changeStep: (handleChangeStepParams: HandleChangeStepParams) => void;
}

export default function CreateDeliveryForm({ defaultValues, changeStep }: CreateDeliveryFormProps) {
  const { data, isLoading } = trpc.useQuery(['store.getStores', { limit: 1000 }]);
  const [storeId, setStoreId] = useState(defaultValues.storeId ? defaultValues.storeId : '');

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
    let amount = 0;

    // add total price of orders
    const currentProducts = data?.records.find((store) => store.id === formData.storeId)?.products;
    if (currentProducts) {
      formData.orders.forEach((order) => {
        const findProduct = currentProducts.find((prd) => prd.size === order.size);
        if (findProduct) amount += findProduct.price * order.quantity;
      });
    }

    // deductions for total price
    if (!!formData.badOrder) amount -= formData.badOrder;
    if (!!formData.widthHoldingTax) amount -= formData.widthHoldingTax;
    if (!!formData.otherDeduction) amount -= formData.otherDeduction;

    const step1FormData = {
      ...formData,
      amount: amount,
    };

    changeStep({
      step: 2,
      data: step1FormData,
    });
  };

  return (
    <form
      className='flex flex-col space-y-4 md:w-[100%] bg-white p-8 rounded-md shadow-md overflow-hidden text-black'
      onSubmit={handleSubmit(createDelivery)}
    >
      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>Create Delivery</h1>
      <br />

      <div className='flex justify-between flex-col space-y-5 lg:flex-row lg:space-x-7 lg:space-y-0'>
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
          required
          type='date'
          label='Posting Date'
          formInput={{ register, property: 'postingDate' }}
          errorMessage={errors.postingDate?.message}
        />
      </div>

      <InputArray
        label='Orders'
        property='orders'
        register={register}
        storeId={storeId}
        fields={orderFields}
        errors={errors}
        control={control}
        append={addOrder}
        remove={removeOrder}
      />

      <InputArray
        label='Return Slip'
        property='returnSlip'
        register={register}
        storeId={storeId}
        fields={returnSlipFields}
        errors={errors}
        control={control}
        append={addReturnSlipItem}
        remove={removeReturnSlipItem}
      />
      <Button buttonTitle='REVIEW' type='submit' />
    </form>
  );
}
