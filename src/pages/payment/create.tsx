import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { PaymentMode } from '@prisma/client';
import { trpc } from '@/utils/trpc';
import { PHpeso } from '@/modules/utils';
import Layout from '@/layouts/index';
import ModalLoader from '@/components/ModalLoader';
import Notification from '@/components/Notification';
import TextField from '@/components/TextField';
import SelectField from '@/components/SelectField';
import Button from '@/components/Button';
import { AttachDeliveries } from '@/modules/payments/AttachDeliveries';
import Collapse from '@/components/Collapse';

const paymenyDataBase = (
  modeOfPayment: z.ZodLiteral<'BANK_TRANSFER' | 'CHEQUE' | 'CASH'>,
  bankName: z.ZodOptional<z.ZodString> | z.ZodString,
) =>
  z.object({
    storeId: z.string().min(1, 'Required'),
    modeOfPayment,
    bankName,
    refNo: z.string().min(1, 'Required'),
    refDate: z.string().min(1, 'Required'),
    amount: z.number().min(1, 'Required'),
    badOrder: z.number({ invalid_type_error: 'Must Input Number' }),
    widthHoldingTax: z.number({ invalid_type_error: 'Must Input Number' }),
    otherDeductions: z.number({ invalid_type_error: 'Must Input Number' }),
  });

const schema = z.object({
  paymentData: z.discriminatedUnion(
    'modeOfPayment',
    [
      paymenyDataBase(z.literal('BANK_TRANSFER'), z.string().min(1, 'Required')),
      paymenyDataBase(z.literal('CHEQUE'), z.string().min(1, 'Required')),
      paymenyDataBase(z.literal('CASH'), z.string().optional()),
    ],
    {
      errorMap: (v) => {
        if (v.code === 'invalid_union_discriminator') return { message: 'Please Choose!' };
        return { message: v.message ?? 'Please Choose!' };
      },
    },
  ),
  deliveries: z
    .array(
      z.object({
        deliveryId: z.string(),
        deliveryNumber: z.string(),
        postingDate: z.string(),
        amount: z.number({ invalid_type_error: 'Must Input Number' }),
      }),
    )
    .min(1, 'Must Attach a delivery!'),
});

type FormSchemaType = z.infer<typeof schema>;

export default function CreatePayment() {
  const [error, setError] = useState('');

  const { mutate, isLoading, isSuccess, isError, error: errs } = trpc.useMutation('payment.create');
  const { data } = trpc.useQuery(['store.getStores', { limit: 1000 }]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    resetField,
    formState: { errors },
    watch,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentData: {
        amount: 0,
        badOrder: 0,
        widthHoldingTax: 0,
        otherDeductions: 0,
      },
    },
  });

  const getAmountOfDeliveries = (deliveries: { amount: number }[]) => {
    return deliveries.reduce((a, b) => a + b.amount, 0);
  };

  const submitPaymentEntry = (formData: FormSchemaType) => {
    mutate(
      {
        paymentData: formData.paymentData,
        deliveryIds: formData.deliveries.map((v) => v.deliveryId),
      },
      {
        onSuccess() {
          resetField('deliveries', { defaultValue: [] });
          reset();
        },
        onError(err) {
          console.log(err);
          setError('Something Went Wrong');
        },
      },
    );
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'paymentData.modeOfPayment' && value.paymentData?.modeOfPayment === 'CASH') resetField('paymentData.bankName');
    });
    return () => subscription.unsubscribe();
  }, [resetField, watch]);

  return (
    <Layout>
      <Head>
        <title>Payment | Create</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ModalLoader open={isLoading}>Saving Payment ...</ModalLoader>
      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>Create Payment</h1>
      <br />
      <form
        className='flex flex-col space-y-4 md:w-[100%] bg-white p-8 rounded-md shadow-md overflow-hidden'
        onSubmit={handleSubmit(submitPaymentEntry)}
      >
        {isSuccess && !error ? <Notification rounded='sm' type='success' message='Payment Saved' /> : ''}
        {isError ? <Notification rounded='sm' type='error' message={errs.message} /> : ''}
        {!!error ? <Notification rounded='sm' type='error' message={error} /> : ''}

        <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-5'>
          <SelectField
            required
            label='Store'
            options={
              data?.records.map((store: any) => {
                return { label: store.name, value: store.id };
              }) || []
            }
            control={control}
            property='paymentData.storeId'
            errorMessage={errors.paymentData?.storeId?.message}
          />

          <SelectField
            required
            label='Mode Of Payment'
            options={Object.entries(PaymentMode).map((v) => ({ label: v[1], value: v[1] }))}
            control={control}
            property='paymentData.modeOfPayment'
            errorMessage={errors.paymentData?.modeOfPayment?.message}
          />
        </div>

        <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-5'>
          <TextField
            required
            label='Bank Name'
            placeholder='enter bank name here'
            formInput={{ register, property: 'paymentData.bankName' }}
            errorMessage={errors.paymentData?.bankName?.message}
            disabled={watch('paymentData.modeOfPayment') === 'CASH'}
          />

          <TextField
            required
            label='Reference Number'
            placeholder='enter reference number here'
            formInput={{ register, property: 'paymentData.refNo' }}
            errorMessage={errors.paymentData?.refNo?.message}
          />
        </div>

        <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-5'>
          <TextField
            required
            type='date'
            label='Reference Date'
            formInput={{ register, property: 'paymentData.refDate' }}
            errorMessage={errors.paymentData?.refDate?.message}
          />

          <TextField
            required
            type='number'
            label='Amount'
            placeholder='enter amount here'
            formInput={{ register, property: 'paymentData.amount' }}
            errorMessage={errors.paymentData?.amount?.message}
          />
        </div>

        <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-5'>
          <TextField
            required
            type='number'
            label='Bad Order'
            placeholder='enter bad order here'
            formInput={{ register, property: 'paymentData.badOrder' }}
            errorMessage={errors.paymentData?.badOrder?.message}
          />

          <TextField
            required
            type='number'
            label='WidthHoldingTax'
            placeholder='enter amount here'
            formInput={{ register, property: 'paymentData.widthHoldingTax' }}
            errorMessage={errors.paymentData?.widthHoldingTax?.message}
          />

          <TextField
            required
            type='number'
            label='OtherDeductions'
            placeholder='enter other deductions here'
            formInput={{ register, property: 'paymentData.otherDeductions' }}
            errorMessage={errors.paymentData?.otherDeductions?.message}
          />
        </div>

        <AttachDeliveries control={control} errorMessage={errors.deliveries?.message} storeId={watch('paymentData.storeId')} />

        <br />

        <Collapse
          isOpen={
            !!watch('paymentData.badOrder') || !!watch('paymentData.widthHoldingTax') || !!watch('paymentData.otherDeductions')
          }
        >
          <div className='rounded-sm w-full md:w-80 shadow-xl p-5 bg-gray-200'>
            <div className='flex justify-between'>
              <span className='font-semibold font-raleway'>Total Deductions:</span>{' '}
              <span>
                {PHpeso.format(
                  watch('paymentData.badOrder') + watch('paymentData.widthHoldingTax') + watch('paymentData.otherDeductions'),
                )}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold font-raleway'>Total Delivery Amount:</span>{' '}
              <span>{PHpeso.format(getAmountOfDeliveries(watch('deliveries')))}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold font-raleway'>Expected Amount:</span>{' '}
              <span>
                {PHpeso.format(
                  getAmountOfDeliveries(watch('deliveries')) -
                    (watch('paymentData.badOrder') + watch('paymentData.widthHoldingTax') + watch('paymentData.otherDeductions')),
                )}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold font-raleway'>Actual Amount:</span>{' '}
              <span>{PHpeso.format(watch('paymentData.amount'))}</span>
            </div>
          </div>
        </Collapse>

        <div className='w-32'>
          <Button buttonTitle='SUBMIT' type='submit' size='sm' />
        </div>
      </form>
    </Layout>
  );
}
