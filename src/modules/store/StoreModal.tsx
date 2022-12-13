import { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import Modal from '@/components/Modal';
import { Overlay } from '@/components/Overlay';
import { trpc } from '@/utils/trpc';
import Loader from '@/components/Loader';
import StoreUpdate from './StoreUpdate';

export interface IStoreModalProps {
  storeId: string;
  resetStoreState: () => void;
  storesRefetch: any;
}

export default function StoreModal({ storeId, resetStoreState, storesRefetch }: IStoreModalProps) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data, refetch } = trpc.useQuery(['store.getById', storeId]);
  const { mutate, isSuccess, isLoading: isDeleting } = trpc.useMutation('store.delete');

  const onDelete = () => {
    if (data?.id)
      mutate(data.id, {
        onSuccess() {
          storesRefetch();
        },
      });
  };

  const resetIsUpdate = () => setIsUpdate(false);

  const refetchCalls = () => {
    storesRefetch();
    refetch();
  };

  if (!data) return <></>;

  if (isUpdate)
    return (
      <StoreUpdate data={data} resetStoreState={resetStoreState} storesRefetch={refetchCalls} resetIsUpdate={resetIsUpdate} />
    );

  if (isDeleting)
    return (
      <>
        <Overlay />
        <OutsideClickHandler onOutsideClick={resetStoreState}>
          <Modal w='w-[80%] md: w-[520px]' p='p-8'>
            <div className='flex flex-row justify-center'>
              <Loader h='h-7' w='w-7' />
              <h1 className='text-xl font-comfortaa'>Removing Store ...</h1>
            </div>
          </Modal>
        </OutsideClickHandler>
      </>
    );

  return (
    <>
      <Overlay />
      <OutsideClickHandler onOutsideClick={resetStoreState}>
        <Modal w='w-[80%] md: w-[520px]' p='p-8'>
          <button type='button' className='absolute top-0 right-0 pr-4 pt-2 hover:text-red-500' onClick={() => resetStoreState()}>
            X
          </button>
          {isSuccess ? (
            <h1 className='text-red-500 text-lg font-comfortaa'>{data.name} removed from list successfuly !</h1>
          ) : (
            <>
              <h1 className=' font-comfortaa font-bold text-2xl'>Store: {data.name}</h1>
              <br />
              <div>
                <h1 className=' font-comfortaa font-bold text-xl'>Products:</h1>
                <table className='table-fixed w-full'>
                  <thead>
                    <tr className='text-left font-comfortaa font-bold text-lg border-b'>
                      <th className=' p-2'>Size</th>
                      <th className=' p-2'>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((product) => {
                      return (
                        <tr key={product.size} className='text-left font-comfortaa font-bold'>
                          <th className='p-2'>{product.size}</th>
                          <th className='p-2'>₱{product.price.toFixed(2)}</th>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {confirmDelete ? (
                <div className='flex flex-row space-x-2 items-end'>
                  <h1 className='font-comfortaa font-bold text-red-500'>Are you sure you want to delete this store?</h1>
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
            </>
          )}
        </Modal>
      </OutsideClickHandler>
    </>
  );
}
