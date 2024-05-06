import Head from 'next/head';
import { useState } from 'react';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

import Layout from '@/layouts/index';
import { FilterModal } from '@/modules/dashboard/Filter';
import { getEndOfMonth, getStartOfMonth } from '@/utils/helper';
import { trpc } from '@/utils/trpc';
import { TransactionGraph } from '@/modules/store/TransactionGraph';

const StoreTag = ({ storeId }: { storeId: string }) => {
  const { data } = trpc.useQuery(['store.getById', storeId]);

  return (
    <div className='text-md rounded-md bg-gray-300 p-3 font-comfortaa'>
      {data?.name ?? 'ALL STORES'}
    </div>
  );
};

function Dashboard() {
  const [startDate, setStartDate] = useState(getStartOfMonth());
  const [endDate, setEndDate] = useState(getEndOfMonth());
  const [storeId, setStoreId] = useState('');

  return (
    <Layout>
      <Head>
        <title>Dashboard</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <br />

      <FilterModal
        startDate={startDate}
        endDate={endDate}
        defaultStoreId={storeId}
        onSearch={({ date1, date2, storeId }) => {
          setStartDate(date1);
          setEndDate(date2);
          setStoreId(storeId);
        }}
      />

      <br />

      <div className='flex justify-between'>
        <div className='flex space-x-5'>
          {storeId ? (
            <StoreTag storeId={storeId} />
          ) : (
            <div className='text-md rounded-md bg-gray-300 p-3 font-comfortaa'>
              {'ALL STORES'}
            </div>
          )}
          <div className='flex'>
            <div className='text-md rounded-md bg-gray-300 p-3 font-comfortaa'>
              {dayjs(startDate).format('MMM DD, YYYY')}
            </div>
            <div className='flex items-center px-3'>-</div>
            <div className='text-md rounded-md bg-gray-300 p-3 font-comfortaa'>
              {dayjs(endDate).format('MMM DD, YYYY')}
            </div>
          </div>
        </div>
      </div>

      <br />

      <div className='grid grid-cols-12 gap-5 pb-8'>
        <div
          className={twMerge(
            'col-span-12 h-[400px] bg-white',
            'rounded-md shadow-lg',
            'pb-16 pt-10 md:px-10',
          )}
        >
          <TransactionGraph
            startDate={startDate}
            endDate={endDate}
            storeId={storeId}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
