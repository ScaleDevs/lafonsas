import * as React from 'react';
import { useRouter } from 'next/router';

import Layout from '@/layouts/index';
import { trpc } from '@/utils/trpc';
import { PHpeso } from '@/modules/utils';

export interface IDetailsProps {}

const Section1 = ({ id }: { id: string }) => {
  const { data, isLoading } = trpc.useQuery(['store.getById', id]);

  return (
    <div className='space-y-5'>
      {isLoading ? (
        <div className='h-12 w-36 animate-pulse rounded-sm bg-slate-400' />
      ) : (
        <h1 className='text-3xl font-medium'>{data?.name}</h1>
      )}

      {isLoading ? (
        <div className='space-y-2'>
          <div className='h-5 w-full max-w-[350px] animate-pulse rounded-sm bg-slate-400' />
          <div className='h-5 w-full max-w-[350px] animate-pulse rounded-sm bg-slate-400' />
          <div className='h-5 w-full max-w-[350px] animate-pulse rounded-sm bg-slate-400' />
        </div>
      ) : (
        <div className='w-full max-w-[350px] space-y-2'>
          {data?.products.map((prd) => (
            <div className='flex justify-between border-b-2 border-gray-500 font-semibold'>
              <p>{prd.size}</p>
              <p>{PHpeso.format(prd.price)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Details(props: IDetailsProps) {
  const router = useRouter();
  return (
    <Layout>
      <Section1 id={router.query.id as string} />
    </Layout>
  );
}
