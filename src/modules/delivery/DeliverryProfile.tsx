import { useState } from 'react';
import dayjs from 'dayjs';
import { Delivery } from '@prisma/client';
import { trpc } from '@/utils/trpc';
import DeliveryDetailsReport from './components/DeliveryDetailsReport';
import Button from '@/components/Button';
import EditDeliveryForm from './components/EditDeliveryForm';
import Notification from '@/components/Notification';
import useDeliveryStoreTrack from '@/store/delivery.store';

const generateInitialEditFormValues = (delivery: Delivery) => {
  return {
    storeId: delivery.storeId,
    deliveryNumber: delivery.deliveryNumber,
    postingDate: dayjs(delivery.postingDate).format('YYYY-MM-DD'),
    orders: delivery.orders || [],
    returnSlip: delivery.returnSlip || [],
  };
};

export interface IDeliveryProfileProps {
  deliveryId: string;
  setDeliveryId: (id: string | null) => void;
}

export default function DeliveryProfile({ deliveryId, setDeliveryId }: IDeliveryProfileProps) {
  const { setDeliveryState } = useDeliveryStoreTrack();
  const { data, isLoading, refetch } = trpc.useQuery(['delivery.getById', deliveryId]);
  const { mutate } = trpc.useMutation('delivery.delete');
  const [isEdit, setIsEdit] = useState(false);
  const [isSuccessEdit, setIsSuccessEdit] = useState(false);

  const handlBackButton = () => setDeliveryId(null);

  const onSuccessfulEdit = () => {
    setIsEdit(false);
    setIsSuccessEdit(true);
    setTimeout(() => {
      setIsSuccessEdit(false);
    }, 5000);
    refetch();
  };

  const onDeleteDelivery = () => {
    mutate(deliveryId, {
      onSuccess() {
        setDeliveryId(null);
        setDeliveryState('deletedDelivery', data?.deliveryNumber);
        setTimeout(() => {
          setDeliveryState('deletedDelivery', null);
        }, 5000);
      },
    });
  };

  if (isLoading || !data) return <></>;

  return (
    <>
      {isSuccessEdit ? (
        <>
          <Notification rounded='sm' type='success' message='Delivery Record Updated' />
          <br />
        </>
      ) : (
        ''
      )}
      <div className='bg-white shadow-lg px-5 py-7 rounded-md'>
        {isEdit ? (
          <>
            <div className='w-24'>
              <Button buttonTitle='Back' size='sm' onClick={() => setIsEdit(false)} />
            </div>
            <EditDeliveryForm
              deliveryId={deliveryId}
              defaultValues={generateInitialEditFormValues(data)}
              onSuccessfulEdit={onSuccessfulEdit}
            />
          </>
        ) : (
          <>
            <div className='flex flex-row justify-between'>
              <div className='w-24'>
                <Button buttonTitle='Back' size='sm' onClick={handlBackButton} />
              </div>
              <div className='flex flex-row space-x-2'>
                <div className='w-24'>
                  <Button buttonTitle='Edit' size='sm' onClick={() => setIsEdit(true)} />
                </div>
                <div className='w-24'>
                  <Button buttonTitle='Delete' size='sm' color='red' onClick={onDeleteDelivery} />
                </div>
              </div>
            </div>
            <br />
            <br />
            <DeliveryDetailsReport deliveryDetails={data} />
          </>
        )}
      </div>
    </>
  );
}
