import { useState } from 'react';
import router from 'next/router';
import dayjs from 'dayjs';

import { PHpeso, tableFormatTimeDisplay } from '../utils';
import { trpc } from '@/utils/trpc';
import Modal from '@/components/Modal';
import { Overlay } from '@/components/Overlay';
import Loader from '@/components/Loader';
import Button from '@/components/Button';
import IconComp from '@/components/Icon';
import AttachDeliveryModal from './AttachDeliveryModal';
import EditPaymentForm from './EditPaymentForm';

export interface IDetailsProps {
  referenceNo: string;
  paymentsRefetch: any;
}

export default function PaymentDetails({ referenceNo, paymentsRefetch }: IDetailsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAddDelivery, setShowAddDelivery] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { data } = trpc.useQuery(['payment.getPayment', { refNo: referenceNo }]);
  const { mutate, isSuccess, isLoading: isDeleting } = trpc.useMutation('payment.delete');
  const { mutate: removeDeliveryMutate, isLoading: isRemovingDelivery } = trpc.useMutation('payment.removeDelivery');
  const ctx = trpc.useContext();

  const modeOfPayment = {
    BANK_TRANSFER: 'BANK TRANSFER',
    CASH: 'CASH',
    CHEQUE: 'CHEQUE',
  };

  const onDelete = () => {
    if (data?.paymentId)
      mutate(data.paymentId, {
        onSuccess() {
          paymentsRefetch();
        },
      });
  };

  const removeDelivery = (deliveryId: string) => {
    removeDeliveryMutate(deliveryId, {
      onSuccess(result) {
        if (!!result)
          ctx.setQueryData(['payment.getPayment', { refNo: referenceNo }], (updater: any) => {
            const updaterData = updater as typeof data;
            return {
              ...updaterData,
              deliveries: updaterData?.deliveries.filter((delivery) => delivery.id !== deliveryId),
            };
          });
      },
    });
  };

  const backToList = () => router.push(`/payment`, undefined, { shallow: true });

  if (!data) return <></>;

  if (isDeleting)
    return (
      <>
        <Overlay />
        <Modal w='w-[80%] md: w-[520px]' p='p-8'>
          <div className='flex flex-row justify-center'>
            <Loader h='h-7' w='w-7' />
            <h1 className='text-xl font-comfortaa'>Removing Payment Record ...</h1>
          </div>
        </Modal>
      </>
    );

  return (
    <>
      <div className='flex justify-between items-center'>
        <div className='py-3 w-[150px]'>
          <Button size='sm' buttonTitle='Back To List' onClick={backToList} font='raleway' color='gray' />
        </div>

        <div className='py-3 w-[150px]'>
          <Button
            size='sm'
            buttonTitle={isEdit ? 'Payment Details' : 'Edit'}
            onClick={() => setIsEdit(!isEdit)}
            font='raleway'
            color='gray'
          />
        </div>
      </div>

      <div className='bg-white shadow-lg px-5 py-7 rounded-md'>
        {isEdit ? (
          <EditPaymentForm
            paymentId={data.paymentId}
            referenceNo={referenceNo}
            defaultValues={{
              amount: data.amount,
              badOrder: data.badOrder,
              widthHoldingTax: data.widthHoldingTax,
              otherDeductions: data.otherDeductions,
            }}
          />
        ) : isSuccess ? (
          <h1 className='text-red-500 text-lg font-comfortaa'>Ref No {data.refNo} payment removed from list successfuly!</h1>
        ) : (
          <div className='space-y-5'>
            <h1 className='font-comfortaa font-bold text-3xl'>Payment Details:</h1>
            <br />

            <div className='border-b-[1px] border-gray-500 flex flex-row justify-between'>
              <h1 className='font-comfortaa font-bold text-xl'>Vendor</h1>
              <p className=' text-lg'>{data.vendorName}</p>
            </div>

            <div className='border-b-[1px] border-gray-500 flex flex-row justify-between'>
              <h1 className='font-comfortaa font-bold text-xl'>Mode Of Payment</h1>
              <p className=' text-lg'>{modeOfPayment[data.modeOfPayment]}</p>
            </div>

            <div className='border-b-[1px] border-gray-500 flex flex-row justify-between'>
              <h1 className='font-comfortaa font-bold text-xl'>Bank Name</h1>
              <p className=' text-lg'>{data.bankName ?? 'N/A'}</p>
            </div>

            <div className='border-b-[1px] border-gray-500 flex flex-row justify-between'>
              <h1 className='font-comfortaa font-bold text-xl'>Reference Number</h1>
              <p className=' text-lg'>{data.refNo}</p>
            </div>

            <div className='border-b-[1px] border-gray-500 flex flex-row justify-between'>
              <h1 className='font-comfortaa font-bold text-xl'>Ref Date</h1>
              <p className=' text-lg'>{`${tableFormatTimeDisplay(data.refDate)}`}</p>
            </div>

            <div className='border-b-[1px] border-gray-500 flex flex-row justify-between'>
              <h1 className='font-comfortaa font-bold text-xl'>Amount</h1>
              <p className=' text-lg'>{PHpeso.format(data.amount)}</p>
            </div>

            <div className='border-b-[1px] border-gray-500 flex flex-row justify-between'>
              <h1 className='font-comfortaa font-bold text-xl'>Bad Order</h1>
              <p className=' text-lg'>{PHpeso.format(data.badOrder)}</p>
            </div>

            <div className='border-b-[1px] border-gray-500 flex flex-row justify-between'>
              <h1 className='font-comfortaa font-bold text-xl'>Width Holding Tax</h1>
              <p className=' text-lg'>{PHpeso.format(data.widthHoldingTax)}</p>
            </div>

            <div className='border-b-[1px] border-gray-500 flex flex-row justify-between'>
              <h1 className='font-comfortaa font-bold text-xl'>Other Deductions</h1>
              <p className=' text-lg'>{PHpeso.format(data.otherDeductions)}</p>
            </div>

            <div className='w-full overflow-x-auto shadow-lg p-6'>
              <div className='flex items-center justify-between w-full min-w-[800px]'>
                <h1 className='font-comfortaa font-bold text-xl'>DELIVERIES:</h1>
                <button
                  className='bg-green-600 hover:bg-green-500 transition-colors duration-200 px-4 py-2 rounded-sm text-white text-2xl'
                  onClick={() => setShowAddDelivery(true)}
                >
                  +
                </button>
              </div>

              {!!showAddDelivery && (
                <AttachDeliveryModal
                  refNo={referenceNo}
                  paymentId={data.paymentId}
                  storeId={data.storeId}
                  onClose={() => setShowAddDelivery(false)}
                />
              )}

              <br />
              <br />

              {isRemovingDelivery ? (
                <div className='flex flex-row justify-center'>
                  <Loader h='h-7' w='w-7' color='fill-gray-400' />
                  <h1 className='text-xl font-comfortaa'>Removing delivery from payment record ...</h1>
                </div>
              ) : (
                <div className='min-w-[800px]'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-gray-500 border-b font-raleway text-xl text-center'>
                        <th className='pb-3 font-semibold'>POSTING DATE</th>
                        <th className='pb-3 font-semibold'>DELIVERY NUMBER</th>
                        <th className='pb-3 font-semibold'>AMOUNT</th>
                        <th className='pb-3 font-semibold'>REMOVE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data ? (
                        data.deliveries.length === 0 ? (
                          <tr className='font-comfortaa h-14 text-center'>
                            <td className='show-modal-ref text-red-500' colSpan={4}>
                              NO RECORD
                            </td>
                          </tr>
                        ) : (
                          data.deliveries.map((entry, index) => (
                            <tr
                              key={index}
                              className='h-14 text-center hover:cursor-pointer hover:bg-gray-300 transition-colors duration-200'
                            >
                              <td>{dayjs(entry.postingDate).format('MMM DD, YYYY')}</td>
                              <td>{entry.deliveryNumber}</td>
                              <td>{PHpeso.format(entry.amount)}</td>
                              <td>
                                <div
                                  className='group w-9 p-2 mx-auto hover:bg-red-400  rounded-md transition-colors duration-200'
                                  onClick={() => removeDelivery(entry.id)}
                                >
                                  <IconComp
                                    iconName='TrashIcon'
                                    iconProps={{ fillColor: 'text-red-500 group-hover:text-white' }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                      ) : null}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <br />

            {confirmDelete ? (
              <div className='flex flex-row space-x-2 items-end'>
                <h1 className='font-comfortaa font-bold text-red-500'>Are you sure you want to delete this payment record?</h1>
                <button className='bg-red-500 px-5 py-2 rounded-sm hover:bg-red-400 text-white' onClick={onDelete}>
                  YES
                </button>
              </div>
            ) : (
              <div className='space-x-3 mt-3 font-comfortaa text-white'>
                <button className='bg-red-500 px-5 py-2 rounded-sm hover:bg-red-400' onClick={() => setConfirmDelete(true)}>
                  DELETE
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
