import { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import { trpc } from '@/utils/trpc';
import SelectField from '@/components/SelectField';
import Modal from '@/components/Modal';
import { Overlay } from '@/components/Overlay';
import Loader from '@/components/Loader';

export interface IAttachDeliveryModalProps {
  refNo: string;
  paymentId: string;
  storeId: string;
  onClose: () => void;
}

export default function AttachDeliveryModal({ refNo, paymentId, storeId, onClose }: IAttachDeliveryModalProps) {
  const [deliveryId, setDeliveryId] = useState('');
  const { data } = trpc.useQuery(['delivery.getDeliveriesByStoreId', storeId]);
  const { mutate, isLoading: isAdding } = trpc.useMutation(['payment.attachDelivery']);
  const ctx = trpc.useContext();

  const attachDelivery = () => {
    mutate(
      { deliveryId, paymentId },
      {
        onSuccess(result) {
          if (!!result)
            ctx.setQueryData(['payment.getPayment', { refNo }], (updater: any) => {
              return {
                ...updater,
                deliveries: [
                  ...(updater?.deliveries ?? []),
                  {
                    id: result.id,
                    storeId: result.storeId,
                    postingDate: result.postingDate,
                    deliveryNumber: result.deliveryNumber,
                    amount: result.amount,
                  },
                ],
              };
            });
        },
        onSettled() {
          onClose();
        },
      },
    );
  };

  return (
    <>
      <Overlay />
      <OutsideClickHandler onOutsideClick={onClose}>
        <Modal w='w-[80%] md: w-[520px]' p='p-8'>
          {isAdding ? (
            <div className='flex flex-row justify-center'>
              <Loader h='h-7' w='w-7' />
              <h1 className='text-xl font-comfortaa'>Attaching Delivery ...</h1>
            </div>
          ) : (
            <>
              <button type='button' className='absolute top-0 right-0 pr-4 pt-2 hover:text-red-500' onClick={() => onClose()}>
                X
              </button>
              <div className='flex flex-row justify-center'>
                <SelectField
                  required
                  label='Select Delivery'
                  options={
                    data?.map((delivery) => {
                      return { label: delivery.deliveryNumber, value: delivery.id };
                    }) || []
                  }
                  onChange={(v) => setDeliveryId(v)}
                  property='delivery'
                />
              </div>

              <button
                className='mt-2 font-comfortaa font-semibold text-white text-sm py-2 px-5 rounded-sm transition-colors duration-200 bg-green-600 hover:bg-green-500'
                onClick={() => attachDelivery()}
                disabled={!deliveryId}
              >
                ATTACH
              </button>
            </>
          )}
        </Modal>
      </OutsideClickHandler>
    </>
  );
}
