import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { trpc } from '@/utils/trpc';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import Notification from '@/components/Notification';

export interface IEditPaymentFormProps {
  paymentId: string;
  referenceNo: string;
  defaultValues: {
    amount: number;
    badOrder: number;
    widthHoldingTax: number;
    otherDeductions: number;
  };
}

const schema = z.object({
  amount: z.number().min(1, 'Required'),
  badOrder: z.number({ invalid_type_error: 'Must Input Number' }),
  widthHoldingTax: z.number({ invalid_type_error: 'Must Input Number' }),
  otherDeductions: z.number({ invalid_type_error: 'Must Input Number' }),
});

type FormSchemaType = z.infer<typeof schema>;

export default function EditPaymentForm({ paymentId, referenceNo, defaultValues }: IEditPaymentFormProps) {
  const ctx = trpc.useContext();
  const { mutate, isLoading, isSuccess, reset } = trpc.useMutation('payment.update');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const submitUpdate = (data: FormSchemaType) => {
    mutate(
      {
        paymentId,
        partialData: data,
      },
      {
        onSuccess() {
          ctx.setQueryData(['payment.getPayment', { refNo: referenceNo }], (updater: any) => {
            return {
              ...updater,
              ...data,
            };
          });
        },
        onSettled() {
          setTimeout(() => {
            reset();
          }, 3000);
        },
      },
    );
  };

  return (
    <div>
      {isSuccess ? <Notification rounded='sm' type='success' message='Payment Updated' /> : ''}

      <br />

      <form onSubmit={handleSubmit(submitUpdate)}>
        <TextField
          required
          type='number'
          label='Amount'
          placeholder='enter amount here'
          formInput={{ register, property: 'amount' }}
          errorMessage={errors?.amount?.message}
        />
        <TextField
          required
          type='number'
          label='Bad Order'
          placeholder='enter bad order here'
          formInput={{ register, property: 'badOrder' }}
          errorMessage={errors?.badOrder?.message}
        />
        <TextField
          required
          type='number'
          label='Width Holding Tax'
          placeholder='enter amount here'
          formInput={{ register, property: 'widthHoldingTax' }}
          errorMessage={errors?.widthHoldingTax?.message}
        />
        <TextField
          required
          type='number'
          label='Other Deductions'
          placeholder='enter amount here'
          formInput={{ register, property: 'otherDeductions' }}
          errorMessage={errors?.otherDeductions?.message}
        />

        <br />

        <Button buttonTitle='SUBMIT' type='submit' isLoading={isLoading} />
      </form>
    </div>
  );
}
