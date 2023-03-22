import { useState } from 'react';
import Head from 'next/head';

import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import { IStore } from '@/utils/types';
import StoreModal from '@/modules/store/StoreModal';
import InputSolo from '@/components/InputSolo';
import IconComp from '@/components/Icon';
import Button from '@/components/Button';
import Paginator from '@/components/Paginator';

export default function ListProducts() {
  const [storeData, setStoreData] = useState<IStore | null>(null);
  const [storeName, setStoreName] = useState<string | undefined>(undefined);
  const [searchError, setSearchError] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.useQuery(['store.getStores', { limit: 10, page, storeName }]);

  const onStoreClick = (data: IStore) => setStoreData({ ...data });
  const resetStoreState = () => setStoreData(null);
  const handlePageChange = (page: number) => setPage(page);

  const handleSearchStore = (inputValue: string) => {
    if (!inputValue || inputValue === '' || inputValue.length < 3) {
      setSearchError('Must be at least 3 characters');
      return;
    }

    setSearchError(undefined);
    setStoreName(inputValue);
  };

  const handleSearchAll = () => {
    setSearchError(undefined);
    setStoreName(undefined);
  };

  return (
    <Layout>
      <Head>
        <title>Store</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {!!storeData ? <StoreModal resetStoreState={resetStoreState} storeId={storeData.id} storesRefetch={refetch} /> : ''}

      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>List Stores</h1>

      <br />
      <br />
      <br />

      <div className='bg-white shadow-lg px-5 py-7 rounded-md'>
        {isLoading ? (
          <TableLoader />
        ) : (
          <>
            <div className='flex flex-row space-x-2 mb-5 h-10'>
              <InputSolo
                placeholder='Search Store'
                isRow
                w='w-auto md:w-64'
                ButtonChildren={<IconComp iconName='SearchIcon' iconProps={{}} />}
                errMsg={searchError}
                onClick={handleSearchStore}
              />
              <div className='w-20'>
                <Button size='sm' buttonTitle='ALL' onClick={handleSearchAll} />
              </div>
            </div>

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
                        className='font-comfortaa h-14 text-center hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200'
                        onClick={() => onStoreClick(store)}
                      >
                        <td className='show-modal-ref'>{store.name}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </>
        )}
        <Paginator currentPage={page} pageCount={data?.pageCount || 0} handlePageChange={handlePageChange} />
      </div>
    </Layout>
  );
}
