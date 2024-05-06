import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/layouts/index';
import CreateDeliveryForm from '@/modules/delivery/CreateDeliveryForm';
import ReviewDelivery from '@/modules/delivery/ReviewDelivery';
import Notification from '@/components/Notification';
import {
  DeliveryFormSchemaType,
  HandleChangeStepParams,
} from '@/modules/delivery/types';

const initialData = {
  storeId: '',
  deliveryNumber: '',
  postingDate: '',
  widthHoldingTax: undefined,
  otherDeduction: undefined,
  badOrder: undefined,
  amountPaid: undefined,
  amount: 0,
  checkDate: '',
  checkNumber: '',
  orders: [],
  returnSlip: [],
};

export default function CreateDelivery() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<DeliveryFormSchemaType>(initialData);

  const handleChangeStep = ({
    step,
    data,
    isSuccessfulSubmit,
    isResetData,
  }: HandleChangeStepParams) => {
    setStep(step);
    if (!!data) setData(data);
    if (isResetData) setData(initialData);
    if (!!isSuccessfulSubmit) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Delivery | Create</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {isSuccess ? (
        <>
          <Notification
            rounded='sm'
            type='success'
            message='Delivery Record Created'
          />
          <br />
        </>
      ) : (
        ''
      )}
      {step === 1 ? (
        <CreateDeliveryForm
          changeStep={handleChangeStep}
          defaultValues={data}
        />
      ) : (
        ''
      )}
      {step === 2 ? (
        <ReviewDelivery deliveryDetails={data} changeStep={handleChangeStep} />
      ) : (
        ''
      )}
    </Layout>
  );
}
