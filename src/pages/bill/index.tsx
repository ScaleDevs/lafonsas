import { useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import dayjs from 'dayjs';

import { trpc } from '@/utils/trpc';
import { getStartOfMonth, getEndOfMonth } from '@/utils/helper';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import Notification from '@/components/Notification';
import { IBill } from '@/utils/types';
import Button from '@/components/Button';
import ListFilter, { FormSchemaType } from '@/modules/bill/ListFilter';
import ExpenseDetails from '@/modules/bill/Details';
import Paginator from '@/components/Paginator';
import { PHpeso } from '@/modules/utils';

const initialFilters = {
  vendor: undefined,
  startDate: getStartOfMonth('YYYY-MM-DD'),
  endDate: getEndOfMonth('YYYY-MM-DD'),
};

export default function ListBills() {
  const [filterModal, setFilterModal] = useState(false);
  const [stateFilters, setStateFilters] = useState<FormSchemaType>(initialFilters);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = trpc.useQuery([
    'bill.getMany',
    {
      limit: 10,
      page,
      vendor: stateFilters.vendor,
      dateFilter: {
        startDate: stateFilters.startDate,
        endDate: stateFilters.endDate,
      },
    },
  ]);

  const onRecordClick = (data: Omit<IBill, 'description'>) => {
    router.push(`/bill/?refNo=${data.invoiceRefNo}`, undefined, { shallow: true });
  };
  const handlePageChange = (page: number) => setPage(page);

  return (
    <Layout>
      <Head>
        <title>Bill</title>
        <meta name='description' content='lafonsas bill list page' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ListFilter
        isOpen={filterModal}
        closeModal={() => setFilterModal(false)}
        stateFilters={stateFilters}
        setStateFilters={setStateFilters}
        handlePageChange={handlePageChange}
      />

      {!!router.query.refNo && typeof router.query.refNo === 'string' ? (
        <ExpenseDetails referenceNo={router.query.refNo} billsRefetch={refetch} />
      ) : (
        <div>
          <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>List Bills</h1>

          <br />
          <div className='w-[100px]'>
            <Button buttonTitle='Filter' size='sm' onClick={() => setFilterModal(true)} />
          </div>

          <br />

          <div className='flex space-x-5'>
            <div className='bg-gray-300 p-3 rounded-md text-md font-comfortaa'>
              {stateFilters.vendor ? stateFilters.vendor : 'ALL VENDORS'}
            </div>
            <div className='flex'>
              <div className='bg-gray-300 p-3 rounded-md text-md font-comfortaa'>
                {dayjs(stateFilters.startDate).format('MMM DD, YYYY')}
              </div>
              <div className='px-3 flex items-center'>-</div>
              <div className='bg-gray-300 p-3 rounded-md text-md font-comfortaa'>
                {dayjs(stateFilters.endDate).format('MMM DD, YYYY')}
              </div>
            </div>
          </div>

          <br />

          {isError ? (
            <>
              <Notification rounded='sm' type='error' message='Something went wrong! Try Again' />
              <br />
            </>
          ) : (
            ''
          )}

          <div className='bg-white shadow-lg px-5 py-7 rounded-md overflow-x-auto'>
            {isLoading ? (
              <TableLoader />
            ) : (
              <>
                <table className='w-full min-w-[800px]'>
                  <thead>
                    <tr className='border-gray-500 border-b font-raleway text-xl text-center'>
                      <th className='pb-3'>DATE</th>
                      <th className='pb-3'>VENDOR</th>
                      <th className='pb-3'>REFERENCE</th>
                      <th className='pb-3'>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data ? (
                      data.records.length === 0 ? (
                        <tr className='font-comfortaa h-14 text-center'>
                          <td className='show-modal-ref text-red-500' colSpan={4}>
                            NO RECORD
                          </td>
                        </tr>
                      ) : (
                        data.records.map((bill) => (
                          <tr
                            key={bill.billId}
                            className='font-comfortaa h-14 text-center hover:cursor-pointer hover:bg-gray-300 transition-colors duration-200'
                            onClick={() => onRecordClick(bill)}
                          >
                            <td className='show-modal-ref'>{dayjs(bill.date).format('MMM DD, YYYY')}</td>
                            <td className='show-modal-ref'>{bill.vendor}</td>
                            <td className='show-modal-ref'>{bill.invoiceRefNo}</td>
                            <td className='show-modal-ref'>{PHpeso.format(bill.amount)}</td>
                          </tr>
                        ))
                      )
                    ) : null}
                  </tbody>
                </table>
              </>
            )}

            <br />

            <Paginator currentPage={page} pageCount={data?.pageCount || 0} handlePageChange={handlePageChange} />
          </div>
        </div>
      )}
    </Layout>
  );
}
