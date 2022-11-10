import { useState } from 'react';
import Layout from '@/layouts/index';
import CreateDeliveryForm, { FormSchemaType } from '@/modules/delivery/CreateDeliveryForm';
import ReviewDelivery from '@/modules/delivery/ReviewDelivery';

export default function CreateDelivery() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormSchemaType & { amount: number }>({
    storeId: '636276fee74296863d8a4eda',
    deliveryNumber: '',
    widthHoldingTax: 0,
    otherDeduction: 0,
    badOrder: 10,
    amountPaid: 0,
    amount: 0,
    checkDate: '',
    checkNumber: '',
    orders: [],
    returnSlip: [],
  });

  const handleChangeStep = (step: number, newData?: FormSchemaType & { amount: number }) => {
    setStep(step);
    if (!!newData) setData(newData);
  };

  return (
    <Layout>
      {step === 1 ? <CreateDeliveryForm changeStep={handleChangeStep} defaultValues={data} /> : ''}
      {step === 2 ? <ReviewDelivery deliveryDetails={data} changeStep={handleChangeStep} /> : ''}
    </Layout>
  );
}
