import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Product } from '@prisma/client';
import { trpc } from '@/utils/trpc';
import TextField from '@/components/TextField';
import SelectField from '@/components/SelectField';
import InputArray from '@/modules/delivery/components/InputArray';
import { IOrder } from './DeliveryDetailsReport';
import Button from '@/components/Button';

const schema = z.object({
  storeId: z.string().min(1, 'Please Choose Store'),
  deliveryNumber: z.string().min(1, 'Please Input Delivery Number'),
  postingDate: z.string().min(1, 'Please Input posting date'),
  orders: z
    .array(
      z.object({
        size: z.string().min(1, 'Please select size'),
        quantity: z.number().min(1, 'Please add quantity'),
      }),
    )
    .min(1, 'Please add an order!'),
  returnSlip: z.array(
    z.object({
      size: z.string().min(1, 'Please select size'),
      quantity: z.number().min(1, 'Please add quantity'),
      price: z.number().min(1, 'Please add price'),
    }),
  ),
});

export type FormSchemaType = z.infer<typeof schema>;

export interface EditDeliveryFormProps {
  deliveryId: string;
  defaultValues: FormSchemaType;
  onSuccessfulEdit: () => void;
}

export default function EditDeliveryForm({
  deliveryId,
  defaultValues,
  onSuccessfulEdit,
}: EditDeliveryFormProps) {
  const { data, isLoading } = trpc.useQuery([
    'store.getStores',
    { limit: 1000 },
  ]);
  const { mutate } = trpc.useMutation('delivery.update');
  const [storeId, setStoreId] = useState(
    defaultValues.storeId ? defaultValues.storeId : '',
  );

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, defaultValues: formDefaultValues, dirtyFields },
    control,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
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

  const updateDelivery = (formData: FormSchemaType) => {
    const partialData = { ...formData } as Partial<
      FormSchemaType & { amount: number; orders: IOrder[] }
    >;

    Object.keys(formData).forEach((key) => {
      const keyField = key as keyof FormSchemaType;
      if (keyField === 'orders' && !!dirtyFields['orders']) {
        partialData['orders'] = partialData['orders'];
      } else if (!dirtyFields[keyField]) delete partialData[keyField];
    });

    mutate(
      {
        deliveryId,
        storeId: formData.storeId,
        partialData,
      },
      {
        onSuccess() {
          onSuccessfulEdit();
        },
      },
    );
  };

  return (
    <form
      className='flex flex-col space-y-4 overflow-hidden p-8 md:w-[100%]'
      onSubmit={handleSubmit(updateDelivery)}
    >
      <h1 className='font-comfortaa text-3xl font-bold md:text-4xl'>
        Edit Delivery
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
          property='storeId'
          control={control}
          errorMessage={errors.storeId?.message}
          onChange={onStoreSelect}
          isLoading={isLoading}
          defaultValue={formDefaultValues?.storeId}
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

      <Button buttonTitle='SUBMIT' type='submit' />
    </form>
  );
}
