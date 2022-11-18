import { trpc } from '@/utils/trpc';
import { FormSchemaType } from './CreateDeliveryForm';
import Button from '@/components/Button';
import ModalLoader from '@/components/ModalLoader';
import Notification from '@/components/Notification';
import { HandleChangeStepParams } from './types';
import DeliveryDetailsReport, { IOrder } from './DeliveryDetailsReport';

export interface ReviewDeliveryProps {
  deliveryDetails: FormSchemaType & { amount: number };
  changeStep: (handleChangeStepParams: HandleChangeStepParams) => void;
}

export default function ReviewDelivery({ deliveryDetails, changeStep }: ReviewDeliveryProps) {
  const { data } = trpc.useQuery(['store.getById', deliveryDetails.storeId]);
  const { mutate, isLoading: isCreating, isError } = trpc.useMutation('delivery.create');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { orders, returnSlip, storeId, badOrder, widthHoldingTax, otherDeduction, ...rest } = deliveryDetails;

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
      checkDate: !!rest.checkDate ? rest.checkDate : null,
      badOrder: !!badOrder ? badOrder : null,
      widthHoldingTax: !!widthHoldingTax ? widthHoldingTax : null,
      otherDeduction: !!otherDeduction ? otherDeduction : null,
      amountPaid: !!rest.amountPaid ? rest.amountPaid : null,
      checkNumber: !!rest.checkNumber ? rest.checkNumber : null,
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
    });
  };

  return (
    <>
      <ModalLoader open={isCreating}>Saving Delivery ...</ModalLoader>
      {isError ? (
        <>
          <Notification rounded='sm' type='error' message='Something went wrong' />
          <br />
        </>
      ) : (
        ''
      )}
      <div className='w-36 pb-4'>
        <Button buttonTitle='Back to Form' size='sm' onClick={backToStep1} />
      </div>
      <div className='flex flex-col space-y-4 md:w-[100%] bg-zinc-900 p-8 rounded-md shadow-md overflow-hidden font-comfortaa'>
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
