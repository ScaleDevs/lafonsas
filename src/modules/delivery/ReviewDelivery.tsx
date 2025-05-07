import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import Button from '@/components/Button';
import ModalLoader from '@/components/ModalLoader';
import Notification from '@/components/Notification';
import { DeliveryFormSchemaType, HandleChangeStepParams } from './types';
import DeliveryDetailsReport, {
  IOrder,
} from './components/DeliveryDetailsReport';

export interface ReviewDeliveryProps {
  deliveryDetails: DeliveryFormSchemaType;
  changeStep: (handleChangeStepParams: HandleChangeStepParams) => void;
}

export default function ReviewDelivery({
  deliveryDetails,
  changeStep,
}: ReviewDeliveryProps) {
  const [errorMessage, setErrorMessage] = useState('Something went wrong');
  const { data } = trpc.useQuery(['store.getById', deliveryDetails.storeId]);
  const {
    mutate,
    isLoading: isCreating,
    isError,
  } = trpc.useMutation('delivery.create');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { orders, returnSlip, storeId, ...rest } = deliveryDetails;

  const backToStep1 = () => changeStep({ step: 1 });

  const getTotalPrice = () => {
    if (!data) return 0;

    let amount = 0;

    // add total price of orders
    const currentProducts = data.products;

    if (currentProducts) {
      deliveryDetails.orders.forEach((order) => {
        const findProduct = currentProducts.find(
          (prd) => prd.size === order.size,
        );
        if (findProduct) amount += findProduct.price * order.quantity;
      });
    }

    return amount;
  };

  const getCompleteDeliveryDetails = () => {
    return {
      ...deliveryDetails,
      amount: getTotalPrice(),
    };
  };

  const handleCreateDelivery = () => {
    if (!data) return;
    const newOrderArr: IOrder[] = [];
    orders.map((ord) => {
      const price = !!data?.products
        ? (data.products.find((prd) => prd.size === ord.size)?.price || 0) *
          ord.quantity
        : 0;
      newOrderArr.push({ size: ord.size, quantity: ord.quantity, price });
    });

    const mutateParams = {
      ...rest,
      storeId,
      orders: newOrderArr,
      returnSlip,
      amount: getTotalPrice(),
      counterNumber: rest.counterNumber ?? null,
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
      <div className='flex flex-col space-y-4 overflow-hidden rounded-md bg-white p-8 font-comfortaa text-black shadow-md md:w-[100%]'>
        <h1 className='text-3xl font-bold md:text-4xl'>Review Delivery</h1>
        <br />

        <div className='flex flex-col justify-between space-y-5 lg:flex-row lg:space-x-7 lg:space-y-0'>
          <div className='w-full space-y-10'>
            <DeliveryDetailsReport
              deliveryDetails={getCompleteDeliveryDetails()}
            />
            <Button buttonTitle='SUBMIT' onClick={handleCreateDelivery} />
          </div>
        </div>
      </div>
    </>
  );
}
