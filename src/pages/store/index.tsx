import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import InputSolo from '@/components/InputSolo';
import IconComp from '@/components/Icon';
import Button from '@/components/Button';
import Paginator from '@/components/Paginator';

export default function ListProducts() {
  const router = useRouter();
  const [storeName, setStoreName] = useState<string | undefined>(undefined);
  const [searchError, setSearchError] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading } = trpc.useQuery(['store.getStores', { limit: 10, page, storeName }]);

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

      <h1 className='font-comfortaa text-3xl font-bold md:text-4xl'>List Stores</h1>

      <br />

      <div className='rounded-md bg-white px-5 py-7 shadow-lg'>
        {isLoading ? (
          <TableLoader />
        ) : (
          <>
            <div className='mb-5 flex h-10 flex-row space-x-2'>
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
                <tr className='border-b border-gray-500 text-center font-raleway text-xl'>
                  <th className='pb-3'>STORE</th>
                </tr>
              </thead>
              <tbody>
                {data
                  ? data.records.map((store) => (
                      <tr
                        key={store.id}
                        className='h-14 text-center font-comfortaa transition-colors duration-200 hover:cursor-pointer hover:bg-gray-200'
                        onClick={() => router.push('/store/' + store.id)}
                      >
                        <td className='show-modal-ref'>{store.name}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </>
        )}

        <br />
        <Paginator currentPage={page} pageCount={data?.pageCount || 0} handlePageChange={handlePageChange} />
      </div>
    </Layout>
  );
}
