import { useState } from 'react';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import { BsXCircle } from 'react-icons/bs';

import Layout from '@/layouts/index';
import { trpc } from '@/utils/trpc';
import { PHpeso } from '@/modules/utils';
import { Pencil1Icon } from '@radix-ui/react-icons';
import StoreUpdate from '@/modules/store/StoreUpdate';
import useDisclosure from '@/modules/hooks/useDisclosure';
import { SKUGraph } from '@/modules/store/SKUReports';
import { getEndOfMonth, getStartOfMonth } from '@/utils/helper';
import { FilterModal } from '@/modules/store/Filter';
import { TransactionGraph } from '@/modules/store/TransactionGraph';

export interface IDetailsProps {}

const Section1 = ({ id }: { id: string }) => {
  const { data, isLoading } = trpc.useQuery(['store.getById', id]);
  const { open: isEdit, toggle } = useDisclosure();

  return (
    <div className='space-y-5'>
      {isLoading ? (
        <div className='h-12 w-36 animate-pulse rounded-sm bg-slate-400' />
      ) : (
        <h1 className='text-3xl font-medium'>{data?.name}</h1>
      )}

      <div
        className={twMerge(
          'w-full',
          isEdit ? 'max-w-[700px]' : 'max-w-[350px]',
          'space-y-5 bg-white p-5',
          'rounded-sm shadow-md',
        )}
      >
        <div className='flex items-center gap-3'>
          <p className='text-xl font-bold'>PRODUCTS</p>
          <div className='h-[1px] w-full bg-gray-500' />
          <div
            className='cursor-pointer rounded-sm bg-gray-200 p-2 hover:bg-gray-100'
            onClick={toggle}
          >
            {isEdit ? <BsXCircle /> : <Pencil1Icon />}
          </div>
        </div>

        {isEdit && data ? (
          <StoreUpdate data={data} />
        ) : (
          <div className='space-y-3'>
            {isLoading ? (
              <>
                <div className='h-5 w-full max-w-[350px] animate-pulse rounded-sm bg-slate-400' />
                <div className='h-5 w-full max-w-[350px] animate-pulse rounded-sm bg-slate-400' />
                <div className='h-5 w-full max-w-[350px] animate-pulse rounded-sm bg-slate-400' />
              </>
            ) : (
              data?.products.map((prd) => (
                <div className='flex justify-between border-b-2 border-gray-500 font-semibold'>
                  <p>{prd.size}</p>
                  <p>{PHpeso.format(prd.price)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Graphs = ({ id }: { id: string }) => {
  const [startDate, setStartDate] = useState(getStartOfMonth());
  const [endDate, setEndDate] = useState(getEndOfMonth());

  return (
    <div>
      <div className='space-y-5'>
        <FilterModal
          startDate={startDate}
          endDate={endDate}
          onSearch={({ date1, date2 }) => {
            setStartDate(date1);
            setEndDate(date2);
          }}
        />

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

      <br />

      <div className='grid grid-cols-2 gap-3 pb-10'>
        <div className='space-y-5 rounded-md bg-white p-5 shadow-lg md:p-10'>
          <div className='flex items-center gap-3 md:px-12'>
            <p className='whitespace-nowrap text-xl font-bold'>SKU REPORTS</p>
            <div className='h-[1px] w-full bg-gray-500' />
          </div>

          <div className='h-[300px] w-full'>
            <SKUGraph startDate={startDate} endDate={endDate} storeId={id} />
          </div>
        </div>

        <div className='space-y-5 rounded-md bg-white p-5 shadow-lg md:p-10'>
          <div className='flex items-center gap-3 md:px-12'>
            <p className='whitespace-nowrap text-xl font-bold'>
              TRANSACTION REPORTS
            </p>
            <div className='h-[1px] w-full bg-gray-500' />
          </div>

          <div className='h-[300px] w-full'>
            <TransactionGraph
              startDate={startDate}
              endDate={endDate}
              storeId={id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Details(props: IDetailsProps) {
  const router = useRouter();

  return (
    <Layout>
      <div className='space-y-5'>
        <Section1 id={router.query.id as string} />
        <Graphs id={router.query.id as string} />
      </div>
    </Layout>
  );
}
