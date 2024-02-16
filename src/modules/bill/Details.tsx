import { useState } from 'react';
import router from 'next/router';
import dayjs from 'dayjs';

import Modal from '@/components/Modal';
import { Overlay } from '@/components/Overlay';
import { trpc } from '@/utils/trpc';
import Loader from '@/components/Loader';
import UpdateForm from './UpdateForm';
import { capFirstLetters, PHpeso, tableFormatTimeDisplay } from '../utils';
import Button from '@/components/Button';

export interface IDetailsProps {
  referenceNo: string;
  billsRefetch: any;
}

export default function Details({ referenceNo, billsRefetch }: IDetailsProps) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data, refetch, isLoading: fetchingBill } = trpc.useQuery(['bill.getBill', { refNo: referenceNo }]);
  const { mutate, isSuccess, isLoading: isDeleting } = trpc.useMutation('bill.delete');

  const onDelete = () => {
    if (data?.billId)
      mutate(data.billId, {
        onSuccess() {
          billsRefetch();
        },
      });
  };

  const resetIsUpdate = () => setIsUpdate(false);

  const backToList = () => router.push(`/bill`, undefined, { shallow: true });

  const refetchCalls = () => {
    billsRefetch();
    refetch();
  };

  if (fetchingBill)
    return (
      <div className='flex h-[40rem] items-center justify-center space-x-3'>
        <Loader h='h-10' w='w-10' color='fill-yellow-500' />
        <p>Fetching Information ...</p>
      </div>
    );

  if (!data) return <></>;

  if (isUpdate) return <UpdateForm data={data} refetchCalls={refetchCalls} resetIsUpdate={resetIsUpdate} />;

  if (isDeleting)
    return (
      <>
        <Overlay />
        <Modal w='w-[80%] md: w-[520px]' p='p-8'>
          <div className='flex flex-row justify-center'>
            <Loader h='h-7' w='w-7' />
            <h1 className='font-comfortaa text-xl'>Removing Bill Record ...</h1>
          </div>
        </Modal>
      </>
    );

  return (
    <div className='rounded-md bg-white px-5 py-7 shadow-lg'>
      <div className='w-16 py-3'>
        <Button size='sm' buttonTitle='Back' onClick={backToList} font='raleway' />
      </div>

      {isSuccess ? (
        <h1 className='font-comfortaa text-lg text-red-500'>{data.invoiceRefNo} bill removed from list successfuly !</h1>
      ) : (
        <div className='space-y-5'>
          <h1 className='font-comfortaa text-3xl font-bold'>Bill Details:</h1>
          <br />
          <div className='flex flex-row justify-between border-b-[1px] border-gray-500'>
            <h1 className='font-comfortaa text-2xl font-bold'>Date</h1>
            <p className=' text-lg'>{`${tableFormatTimeDisplay(data.date)}`}</p>
          </div>

          <div className='flex flex-row justify-between border-b-[1px] border-gray-500'>
            <h1 className='font-comfortaa text-2xl font-bold'>Vendor</h1>
            <p className=' text-lg'>{data.vendor}</p>
          </div>

          <div className='flex flex-row justify-between border-b-[1px] border-gray-500'>
            <h1 className='font-comfortaa text-2xl font-bold'>Reference Number</h1>
            <p className=' text-lg'>{data.invoiceRefNo}</p>
          </div>

          <div className='flex flex-row justify-between border-b-[1px] border-gray-500'>
            <h1 className='font-comfortaa text-2xl font-bold'>Amount</h1>
            <p className=' text-lg'>{PHpeso.format(data.amount)}</p>
          </div>

          <div className='w-full overflow-x-auto'>
            <div className='min-w-[800px]'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-500 text-center font-raleway text-xl'>
                    <th className='pb-3'>DATE</th>
                    <th className='pb-3'>ACCOUNT</th>
                    <th className='pb-3'>AMOUNT</th>
                    <th className='pb-3'>DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data ? (
                    data.expenses.length === 0 ? (
                      <tr className='h-14 text-center font-comfortaa'>
                        <td className='show-modal-ref text-red-500' colSpan={4}>
                          NO RECORD
                        </td>
                      </tr>
                    ) : (
                      data.expenses.map((entry, index) => (
                        <tr
                          key={index}
                          className='h-14 text-center transition-colors duration-200 hover:cursor-pointer hover:bg-gray-300'
                        >
                          <td>{dayjs(entry.date).format('MMM DD, YYYY')}</td>
                          <td>{capFirstLetters(entry.accountName)}</td>
                          <td>{PHpeso.format(entry.amount)}</td>
                          <td>{entry.description}</td>
                        </tr>
                      ))
                    )
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <br />

          {confirmDelete ? (
            <div className='flex flex-row items-end space-x-2'>
              <h1 className='font-comfortaa font-bold text-red-500'>Are you sure you want to delete this bill?</h1>
              <button className='rounded-sm bg-red-500 px-5 py-2 hover:bg-red-400' onClick={onDelete}>
                YES
              </button>
            </div>
          ) : (
            <div className='mt-3 space-x-3 font-comfortaa text-white'>
              <button className='rounded-sm bg-blue-500 px-5 py-2 hover:bg-blue-400' onClick={() => setIsUpdate(true)}>
                UPDATE
              </button>
              <button className='rounded-sm bg-red-500 px-5 py-2 hover:bg-red-400' onClick={() => setConfirmDelete(true)}>
                DELETE
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
