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

const schema = z.object({
  storeId: z.string().min(1, 'Please Choose Store'),
  deliveryNumber: z.string().min(1, 'Please Input Delivery Number'),
  postingDate: z.string().min(1, 'Please Input posting date'),
  badOrder: z.number().optional(),
  widthHoldingTax: z.number().optional(),
  otherDeduction: z.number().optional(),
  amountPaid: z.number().optional(),
  checkNumber: z.string().optional(),
  checkDate: z.string().optional(),
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

export default function EditDeliveryForm({ deliveryId, defaultValues, onSuccessfulEdit }: EditDeliveryFormProps) {
  const { data, isLoading } = trpc.useQuery(['store.getStores', { limit: 1000 }]);
  const { mutate } = trpc.useMutation('delivery.update');
  const [storeId, setStoreId] = useState(defaultValues.storeId ? defaultValues.storeId : '');

  const {
    setValue,
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
    const amountDependency = {
      badOrder: true,
      widthHoldingTax: true,
      otherDeduction: true,
      orders: true,
    } as any;

    const partialData = { ...formData } as Partial<FormSchemaType & { amount: number; orders: IOrder[] }>;
    const currentProducts: Product[] = data?.records.find((store) => store.id === formData.storeId)?.products || [];
    const newOrderArr: IOrder[] = [];

    Object.keys(formData).forEach((key) => {
      const keyField = key as keyof FormSchemaType;
      if (keyField === 'orders' && !!dirtyFields['orders']) {
        formData.orders.map((ord) => {
          const price = !!currentProducts ? (currentProducts.find((prd) => prd.size === ord.size)?.price || 0) * ord.quantity : 0;
          newOrderArr.push({ size: ord.size, quantity: ord.quantity, price });
        });

        partialData['orders'] = newOrderArr;
      } else if (!dirtyFields[keyField]) delete partialData[keyField];

      if (amountDependency[keyField] && !!dirtyFields[keyField]) {
        let tempAmount = 0;

        // add total price of orders
        if (currentProducts) {
          formData.orders.forEach((order) => {
            const findProduct = currentProducts.find((prd) => prd.size === order.size);
            if (findProduct) tempAmount += findProduct.price * order.quantity;
          });
        }

        // deductions for total price
        if (!!formData.badOrder) tempAmount -= formData.badOrder;
        if (!!formData.widthHoldingTax) tempAmount -= formData.widthHoldingTax;
        if (!!formData.otherDeduction) tempAmount -= formData.otherDeduction;
        partialData['amount'] = tempAmount;
      }
    });

    mutate(
      {
        deliveryId,
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
      className='flex flex-col space-y-4 md:w-[100%] bg-zinc-900 p-8 rounded-md shadow-md overflow-hidden'
      onSubmit={handleSubmit(updateDelivery)}
    >
      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>Edit Delivery</h1>
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
          formInput={{ setValue, property: 'storeId' }}
          errorMessage={errors.storeId?.message}
          onChange={onStoreSelect}
          isLoading={isLoading}
          defaultValue={formDefaultValues?.storeId}
        />

        <TextField
          required
          label='Delivery Number'
          placeholder='enter delivery number here'
          formInput={{ setValue, property: 'deliveryNumber' }}
          errorMessage={errors.deliveryNumber?.message}
          defaultValue={formDefaultValues?.deliveryNumber}
        />

        <TextField
          required
          type='date'
          label='Posting Date'
          formInput={{ setValue, property: 'postingDate' }}
          errorMessage={errors.postingDate?.message}
          defaultValue={formDefaultValues?.postingDate}
        />
      </div>

      <div className='flex justify-between flex-col space-y-5 lg:flex-row lg:space-x-7 lg:space-y-0'>
        <TextField
          label='Bad Order'
          type='number'
          placeholder='enter bad order here'
          formInput={{ setValue, property: 'badOrder' }}
          errorMessage={errors.badOrder?.message}
          defaultValue={formDefaultValues?.badOrder}
        />

        <TextField
          label='Width Holding Tax'
          type='number'
          placeholder='enter width holding tax here'
          formInput={{ setValue, property: 'widthHoldingTax' }}
          errorMessage={errors.widthHoldingTax?.message}
          defaultValue={formDefaultValues?.widthHoldingTax}
        />

        <TextField
          label='Other Deductions'
          type='number'
          placeholder='enter other deductions here'
          formInput={{ setValue, property: 'otherDeduction' }}
          errorMessage={errors.otherDeduction?.message}
          defaultValue={formDefaultValues?.otherDeduction}
        />
      </div>

      <div className='flex justify-between flex-col space-y-5 lg:flex-row lg:space-x-7 lg:space-y-0'>
        <TextField
          label='Amount Paid'
          type='number'
          placeholder='enter amount paid here'
          formInput={{ setValue, property: 'amountPaid' }}
          errorMessage={errors.amountPaid?.message}
          defaultValue={formDefaultValues?.amountPaid}
        />

        <TextField
          label='Check Number'
          placeholder='enter check number here'
          formInput={{ setValue, property: 'checkNumber' }}
          errorMessage={errors.checkNumber?.message}
          defaultValue={formDefaultValues?.checkNumber}
        />

        <TextField
          type='date'
          label='Check Date'
          placeholder='enter check date here'
          formInput={{ setValue, property: 'checkDate' }}
          errorMessage={errors.checkDate?.message}
          defaultValue={formDefaultValues?.checkDate}
        />
      </div>

      <InputArray
        storeId={storeId}
        fields={orderFields}
        errors={errors}
        setValue={setValue}
        append={addOrder}
        remove={removeOrder}
        label='Orders'
        property='orders'
        defaultValues={formDefaultValues?.orders}
      />

      <InputArray
        storeId={storeId}
        fields={returnSlipFields}
        errors={errors}
        setValue={setValue}
        append={addReturnSlipItem}
        remove={removeReturnSlipItem}
        label='Return Slip'
        property='returnSlip'
        defaultValues={formDefaultValues?.returnSlip}
      />

      <button
        type='submit'
        className='p-3 rounded-sm font-comfortaa transition-colors duration-500 bg-blue-600 hover:bg-blue-400'
      >
        UPDATE
      </button>
    </form>
  );
}
