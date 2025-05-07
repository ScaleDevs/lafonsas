import { useState } from 'react';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import { BsTrash, BsXCircle } from 'react-icons/bs';
import { TbLoader } from 'react-icons/tb';
import { Pencil1Icon } from '@radix-ui/react-icons';

import Layout from '@/layouts/index';
import { trpc } from '@/utils/trpc';
import { PHpeso } from '@/modules/utils';
import StoreUpdate from '@/modules/store/StoreUpdate';
import useDisclosure from '@/modules/hooks/useDisclosure';
import { SKUGraph } from '@/modules/store/SKUReports';
import { getEndOfMonth, getStartOfMonth } from '@/utils/helper';
import { FilterModal } from '@/modules/store/Filter';
import { TransactionGraph } from '@/modules/store/TransactionGraph';
import { cn } from '@/shadcn/lib/utils';
import TableLoader from '@/components/TableLoader';
import Paginator from '@/components/Paginator';
import SelectField from '@/components/SelectField';
import Button from '@/components/Button';
import FadeIn from '@/components/FadeIn';

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

      <div className='grid grid-cols-1 gap-3 pb-10 lg:grid-cols-2'>
        <div className='flex flex-col'>
          <div className='w-fit rounded-t-md bg-white p-3 shadow-inner'>
            SKU REPORT
          </div>
          <div
            className={twMerge(
              'space-y-5 bg-white',
              'pb-24 pt-3 md:pr-10',
              'rounded-b-md rounded-tr-md shadow-lg',
            )}
          >
            <div className='h-[400px] w-full'>
              <SKUGraph startDate={startDate} endDate={endDate} storeId={id} />
            </div>
          </div>
        </div>

        <div className='flex flex-col'>
          <div className='w-fit rounded-t-md bg-white p-3 shadow-inner'>
            TRANSCATIONS REPORT
          </div>
          <div
            className={twMerge(
              'space-y-5 bg-white',
              'pb-24 pt-3 md:pr-10',
              'rounded-b-md rounded-tr-md shadow-lg',
            )}
          >
            <div className='h-[400px] w-full'>
              <TransactionGraph
                startDate={startDate}
                endDate={endDate}
                storeId={id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({
  id,
  storeName,
  parentStoreId,
  page,
}: {
  id: string;
  storeName: string;
  parentStoreId: string;
  page: number;
}) => {
  const { mutate, isLoading } = trpc.useMutation('store.removeChildStore');
  const ctx = trpc.useContext();

  const removeChildStore = async () => {
    try {
      mutate(id, {
        onSuccess() {
          ctx.setQueryData(
            ['store.getStores', { parentStoreId, page, limit: 10 }],
            (curr: any) => {
              return {
                ...curr,
                records: curr.records.filter((v: any) => v.id != id),
              };
            },
          );
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <tr className='h-14 text-left font-comfortaa transition-colors duration-200 hover:bg-gray-200'>
      <td>{storeName}</td>
      <td>
        <button
          className=' rounded-md bg-red-500 p-3'
          onClick={removeChildStore}
          disabled={isLoading}
        >
          {isLoading ? (
            <TbLoader className='animate-spin text-lg text-white' />
          ) : (
            <BsTrash className='text-white' />
          )}
        </button>
      </td>
    </tr>
  );
};

const AddNewChildStore = ({
  parentStoreId,
  page,
}: {
  parentStoreId: string;
  page: number;
}) => {
  const ctx = trpc.useContext();

  const [childStoreId, setChildStoreId] = useState('');
  const [errMessage, setErrMessage] = useState('');

  const { mutate, isLoading: isLinking } = trpc.useMutation(
    'store.linkChildStore',
  );

  const {
    data: soloStores,
    isLoading: fetchingStoresOption,
    refetch,
  } = trpc.useQuery(['store.getStores', { limit: 1000 }]);

  const addNewChildStore = () => {
    if (!childStoreId) {
      setErrMessage('You have not chosen a child store!');
      return;
    }

    mutate(
      {
        childStoreId,
        parentStoreId,
      },
      {
        onSuccess(newChildStoreData) {
          refetch();
          ctx.setQueryData(
            ['store.getStores', { parentStoreId, page, limit: 10 }],
            (curr: any) => {
              return {
                ...curr,
                records: newChildStoreData
                  ? [
                      ...curr.records,
                      {
                        id: newChildStoreData?.id,
                        name: newChildStoreData?.name,
                        isParent: newChildStoreData?.isParent,
                        parentStore: newChildStoreData?.parentStore,
                      },
                    ]
                  : curr.records,
              };
            },
          );
        },
        onError(error) {
          console.error(error);
          setErrMessage(
            'Something Went Wrong! Try Again Later or Contact Admin',
          );
        },
      },
    );
  };

  return (
    <>
      {' '}
      <p className='font-medium'>Add New Child Store:</p>
      <div className='flex w-1/2 justify-start gap-3'>
        <SelectField
          property='childStoreAdd'
          options={
            soloStores?.records
              .filter((store) => !store.isParent && !store.parentStore)
              .map((store: any) => {
                return { label: store.name, value: store.id };
              }) || []
          }
          isLoading={fetchingStoresOption}
          onChange={(v) => {
            setChildStoreId(v);
            setErrMessage('');
          }}
        />

        <div className='min-w-48'>
          <Button
            buttonTitle='ADD'
            className='h-full p-0'
            onClick={addNewChildStore}
            isLoading={isLinking}
          />
        </div>
      </div>
      {errMessage && (
        <FadeIn cssText='text-red-500' duration='animation-duration-200'>
          {errMessage}
        </FadeIn>
      )}
    </>
  );
};

const ChildStores = ({ parentStoreId }: { parentStoreId: string }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.useQuery([
    'store.getStores',
    { parentStoreId, page, limit: 10 },
  ]);

  return (
    <div className='overflow-x-auto rounded-md bg-white px-5 py-7 shadow-lg'>
      {isLoading ? (
        <TableLoader />
      ) : (
        <>
          <AddNewChildStore parentStoreId={parentStoreId} page={page} />

          <br />

          <table className='w-full min-w-[800px]'>
            <thead>
              <tr className='border-b border-gray-500 text-left font-raleway text-xl'>
                <th className='pb-3'>Store</th>
                <th className='pb-3'></th>
              </tr>
            </thead>
            <tbody>
              {data
                ? data.records.map((store) => (
                    <TableRow
                      key={store.id}
                      id={store.id}
                      storeName={store.name}
                      parentStoreId={parentStoreId}
                      page={page}
                    />
                  ))
                : null}
            </tbody>
          </table>
        </>
      )}

      <br />

      <Paginator
        currentPage={page}
        pageCount={data?.pageCount || 0}
        handlePageChange={(v) => setPage(v)}
      />
    </div>
  );
};

const Section2 = ({ id }: { id: string }) => {
  const { data, isLoading } = trpc.useQuery(['store.getById', id]);

  const [tabVal, setTabVal] = useState(1);

  return (
    <div>
      {data?.isParent && (
        <div className='flex flex-row justify-center gap-8'>
          <div
            className={cn(
              'cursor-pointer',
              'text-gray-800',
              tabVal === 1
                ? 'border-b-2 border-primary pb-1 text-primary'
                : 'hover:text-gray-600',
            )}
            onClick={() => setTabVal(1)}
          >
            <p className='text-2xl'>Child Stores</p>
          </div>
          <div
            className={cn(
              'cursor-pointer',
              'text-gray-800',
              tabVal === 2
                ? 'border-b-2 border-primary pb-1 text-primary'
                : 'hover:text-gray-600',
            )}
            onClick={() => setTabVal(2)}
          >
            <p className='text-2xl'>Graphs</p>
          </div>
        </div>
      )}

      <br />

      {isLoading ? (
        <div className='flex h-[25rem] w-full items-center justify-center'>
          <div className='flex flex-col items-center justify-center gap-5'>
            <p className='text-2xl'>Loading Content</p>
            <TbLoader className='animate-spin text-5xl' />
          </div>
        </div>
      ) : (
        <>
          {tabVal === 1 && !!data?.isParent && (
            <ChildStores parentStoreId={id} />
          )}
          {(tabVal === 2 || !data?.isParent) && <Graphs id={id} />}
        </>
      )}
    </div>
  );
};

export default function Details(props: IDetailsProps) {
  const router = useRouter();

  return (
    <Layout>
      <div className='space-y-8'>
        <Section1 id={router.query.id as string} />
        <Section2 id={router.query.id as string} />
      </div>
    </Layout>
  );
}
