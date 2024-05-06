import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';

import Layout from '@/layouts/index';
import { trpc } from '@/utils/trpc';
import { PHpeso } from '@/modules/utils';
import { Pencil1Icon } from '@radix-ui/react-icons';
import StoreUpdate from '@/modules/store/StoreUpdate';
import { BsXCircle } from 'react-icons/bs';
import useDisclosure from '@/modules/hooks/useDisclosure';

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

export default function Details(props: IDetailsProps) {
  const router = useRouter();

  return (
    <Layout>
      <Section1 id={router.query.id as string} />
    </Layout>
  );
}
