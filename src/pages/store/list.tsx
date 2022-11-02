import { useState } from 'react';

import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import { IStore } from '@/utils/types';
import StoreModal from '@/modules/store/StoreModal';

export default function ListProducts() {
  const [storeData, setStoreData] = useState<IStore | null>(null);
  const { data, isLoading, refetch } = trpc.useQuery(['store.getStores', {}]);

  const onStoreClick = (data: IStore) => setStoreData({ ...data });
  const resetStoreState = () => setStoreData(null);

  return (
    <Layout>
      {!!storeData ? <StoreModal resetStoreState={resetStoreState} data={storeData} storesRefetch={refetch} /> : ''}

      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>List Products</h1>

      <br />
      <br />
      <br />

      <div className='bg-slate-200 shadow-lg px-5 py-10 rounded-md'>
        {isLoading ? (
          <TableLoader />
        ) : (
          <table className='w-full'>
            <thead>
              <tr className='border-gray-500 border-b font-raleway text-xl text-center'>
                <th className='pb-3'>STORE</th>
              </tr>
            </thead>
            <tbody>
              {data
                ? data.records.map((store) => (
                    <tr
                      key={store.id}
                      className='font-comfortaa h-14 text-center hover:cursor-pointer hover:bg-gray-700 transition-colors duration-200'
                      onClick={() => onStoreClick(store)}
                    >
                      <td className='show-modal-ref'>{store.name}</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
