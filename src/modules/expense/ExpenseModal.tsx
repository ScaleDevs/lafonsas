import { useState } from 'react';
import dayjs from 'dayjs';
import OutsideClickHandler from 'react-outside-click-handler';

import Modal from '@/components/Modal';
import { Overlay } from '@/components/Overlay';
import { trpc } from '@/utils/trpc';
import Loader from '@/components/Loader';
import ExpenseUpdateForm from './ExpenseUpdateForm';

export interface IExpenseModalProps {
  expenseId: string;
  resetExpenseData: () => void;
  expensesRefetch: any;
}

export default function ExpenseModal({ expenseId, expensesRefetch, resetExpenseData }: IExpenseModalProps) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data, refetch } = trpc.useQuery(['expense.getById', expenseId]);
  const { mutate, isSuccess, isLoading: isDeleting } = trpc.useMutation('expense.delete');

  const onDelete = () => {
    if (data?.id)
      mutate(data.id, {
        onSuccess() {
          expensesRefetch();
        },
      });
  };

  const resetIsUpdate = () => setIsUpdate(false);

  const refetchCalls = () => {
    expensesRefetch();
    refetch();
  };

  if (!data) return <></>;

  if (isUpdate)
    return (
      <ExpenseUpdateForm
        data={data}
        resetExpenseData={resetExpenseData}
        refetchCalls={refetchCalls}
        resetIsUpdate={resetIsUpdate}
      />
    );

  if (isDeleting)
    return (
      <>
        <Overlay />
        <OutsideClickHandler onOutsideClick={resetExpenseData}>
          <Modal w='w-[80%] md: w-[520px]' p='p-8'>
            <div className='flex flex-row justify-center'>
              <Loader h='h-7' w='w-7' />
              <h1 className='text-xl font-comfortaa'>Removing Expense Record ...</h1>
            </div>
          </Modal>
        </OutsideClickHandler>
      </>
    );

  return (
    <>
      <Overlay />
      <OutsideClickHandler onOutsideClick={resetExpenseData}>
        <Modal w='w-[80%] md: w-[520px]' p='p-8'>
          <button
            type='button'
            className='absolute top-0 right-0 pr-4 pt-2 hover:text-red-500'
            onClick={() => resetExpenseData()}
          >
            X
          </button>
          {isSuccess ? (
            <h1 className='text-red-500 text-lg font-comfortaa'>{data.name} expense removed from list successfuly !</h1>
          ) : (
            <div className='space-y-5'>
              <h1 className='font-comfortaa font-bold text-3xl'>Expense Details:</h1>
              <br />
              <div>
                <h1 className='font-comfortaa font-bold text-2xl text-blue-500'>Name:</h1>
                <p className='font-raleway text-lg'>{data.name}</p>
              </div>
              <div>
                <h1 className='font-comfortaa font-bold text-2xl text-blue-500'>Description:</h1>
                <p className='font-raleway text-lg'>{data.description}</p>
              </div>
              <div>
                <h1 className='font-comfortaa font-bold text-2xl text-blue-500'>Categor:</h1>
                <p className='font-raleway text-lg'>{data.category}</p>
              </div>
              <div>
                <h1 className='font-comfortaa font-bold text-2xl text-blue-500'>Date:</h1>
                <p className='font-raleway text-lg'>{dayjs(data.expenseDate).format('MMM DD, YYYY')}</p>
              </div>
              <div>
                <h1 className='font-comfortaa font-bold text-2xl text-blue-500'>Amount:</h1>
                <p className='font-raleway text-lg'>₱{data.amount}</p>
              </div>
              <br />
              {confirmDelete ? (
                <div className='flex flex-row space-x-2 items-end'>
                  <h1 className='font-comfortaa font-bold text-red-500'>Are you sure you want to delete this expense?</h1>
                  <button className='bg-red-500 px-5 py-2 rounded-sm hover:bg-red-400' onClick={onDelete}>
                    YES
                  </button>
                </div>
              ) : (
                <div className='space-x-3 mt-3 font-comfortaa text-white'>
                  <button className='bg-blue-500 px-5 py-2 rounded-sm hover:bg-blue-400' onClick={() => setIsUpdate(true)}>
                    UPDATE
                  </button>
                  <button className='bg-red-500 px-5 py-2 rounded-sm hover:bg-red-400' onClick={() => setConfirmDelete(true)}>
                    DELETE
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </OutsideClickHandler>
    </>
  );
}
