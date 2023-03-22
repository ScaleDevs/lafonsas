import { useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import dayjs from 'dayjs';

import { trpc } from '@/utils/trpc';
import { getStartOfMonth, getEndOfMonth } from '@/utils/helper';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import Notification from '@/components/Notification';
import { IExpense } from '@/utils/types';
import Button from '@/components/Button';
import ListExpensesFilter, { FormSchemaType } from '@/modules/expense/ListExpensesFilter';
import ExpenseDetails from '@/modules/expense/ExpenseDetails';
import Paginator from '@/components/Paginator';

const initialFilters = {
  vendor: undefined,
  startDate: getStartOfMonth('YYYY-MM-DD'),
  endDate: getEndOfMonth('YYYY-MM-DD'),
};

export default function ListExpenses() {
  const [filterModal, setFilterModal] = useState(false);
  const [stateFilters, setStateFilters] = useState<FormSchemaType>(initialFilters);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = trpc.useQuery([
    'expense.getMany',
    {
      limit: 10,
      page,
      startDate: stateFilters.startDate,
      endDate: stateFilters.endDate,
      vendor: stateFilters.vendor,
    },
  ]);

  const onRecordClick = (data: Omit<IExpense, 'description'>) => {
    router.push(`/expense/?refNo=${data.invoiceRefNo}`, undefined, { shallow: true });
  };
  const handlePageChange = (page: number) => setPage(page);

  return (
    <Layout>
      <Head>
        <title>Store</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ListExpensesFilter
        isOpen={filterModal}
        closeModal={() => setFilterModal(false)}
        stateFilters={stateFilters}
        setStateFilters={setStateFilters}
        handlePageChange={handlePageChange}
      />

      {!!router.query.refNo && typeof router.query.refNo === 'string' ? (
        <ExpenseDetails referenceNo={router.query.refNo} expensesRefetch={refetch} />
      ) : (
        <>
          <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>List Expenses</h1>

          <br />
          <br />
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

          <div className='bg-white shadow-lg px-5 py-7 rounded-md'>
            {isLoading ? (
              <TableLoader />
            ) : (
              <>
                <table className='w-full'>
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
                        data.records.map((expense) => (
                          <tr
                            key={expense.expenseId}
                            className='font-comfortaa h-14 text-center hover:cursor-pointer hover:bg-gray-300 transition-colors duration-200'
                            onClick={() => onRecordClick(expense)}
                          >
                            <td className='show-modal-ref'>{dayjs(expense.date).format('MMM DD, YYYY')}</td>
                            <td className='show-modal-ref'>{expense.vendor}</td>
                            <td className='show-modal-ref'>{expense.invoiceRefNo}</td>
                            <td className='show-modal-ref'>₱{expense.amount}</td>
                          </tr>
                        ))
                      )
                    ) : null}
                  </tbody>
                </table>
              </>
            )}

            <Paginator currentPage={page} pageCount={data?.pageCount || 0} handlePageChange={handlePageChange} />
          </div>
        </>
      )}
    </Layout>
  );
}
