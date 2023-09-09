import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import Button from '@/components/Button';
import ModalLoader from '@/components/ModalLoader';
import Notification from '@/components/Notification';
import { DeliveryFormSchemaType, HandleChangeStepParams } from './types';
import DeliveryDetailsReport, { IOrder } from './components/DeliveryDetailsReport';

export interface ReviewDeliveryProps {
  deliveryDetails: DeliveryFormSchemaType & { amount: number };
  changeStep: (handleChangeStepParams: HandleChangeStepParams) => void;
}

export default function ReviewDelivery({ deliveryDetails, changeStep }: ReviewDeliveryProps) {
  const [errorMessage, setErrorMessage] = useState('Something went wrong');
  const { data } = trpc.useQuery(['store.getById', deliveryDetails.storeId]);
  const { mutate, isLoading: isCreating, isError } = trpc.useMutation('delivery.create');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { orders, returnSlip, storeId, ...rest } = deliveryDetails;

  const backToStep1 = () => changeStep({ step: 1 });

  const handleCreateDelivery = () => {
    if (!data) return;
    const newOrderArr: IOrder[] = [];
    orders.map((ord) => {
      const price = !!data?.products ? (data.products.find((prd) => prd.size === ord.size)?.price || 0) * ord.quantity : 0;
      newOrderArr.push({ size: ord.size, quantity: ord.quantity, price });
    });

    const mutateParams = {
      ...rest,
      storeId,
      orders: newOrderArr,
      returnSlip,
    };

    mutate(mutateParams, {
      onSuccess() {
        changeStep({
          step: 1,
          isResetData: true,
          isSuccessfulSubmit: true,
        });
      },
      onError(error) {
        setErrorMessage(error.message);
      },
    });
  };

  return (
    <>
      <ModalLoader open={isCreating}>Saving Delivery ...</ModalLoader>
      {isError ? (
        <>
          <Notification rounded='sm' type='error' message={errorMessage} />
          <br />
        </>
      ) : (
        ''
      )}
      <div className='w-36 pb-4'>
        <Button buttonTitle='Back to Form' size='sm' onClick={backToStep1} />
      </div>
      <div className='flex flex-col space-y-4 md:w-[100%] bg-white p-8 rounded-md shadow-md overflow-hidden font-comfortaa text-black'>
        <h1 className='text-3xl md:text-4xl font-bold'>Review Delivery</h1>
        <br />

        <div className='flex justify-between flex-col space-y-5 lg:flex-row lg:space-x-7 lg:space-y-0'>
          <div className='w-full space-y-10'>
            <DeliveryDetailsReport deliveryDetails={deliveryDetails} />
            <Button buttonTitle='SUBMIT' onClick={handleCreateDelivery} />
          </div>
        </div>
      </div>
    </>
  );
}
