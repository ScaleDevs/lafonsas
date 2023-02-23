import { useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import dayjs from 'dayjs';
import ReactPaginate from 'react-paginate';

import { trpc } from '@/utils/trpc';
import { getStartOfMonth, getEndOfMonth } from '@/utils/helper';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import Notification from '@/components/Notification';
import { IExpense } from '@/utils/types';
import Button from '@/components/Button';
import ListExpensesFilter, { FormSchemaType } from '@/modules/expense/ListExpensesFilter';
import ExpenseDetails from '@/modules/expense/ExpenseDetails';

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
  const handlePageChange = ({ selected }: { selected: number }) => setPage(selected + 1);

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
            <ReactPaginate
              breakLabel='...'
              nextLabel={page === data?.pageCount ? '' : '>'}
              previousLabel={page === 1 ? '' : '<'}
              onPageChange={handlePageChange}
              pageRangeDisplayed={6}
              pageCount={data?.pageCount || 0}
              breakClassName=''
              containerClassName='flex flex-row space-x-7 items-center justify-center pt-10 font-comfortaa text-xl'
              activeClassName='bg-green-700 p-[10px] rounded-sm text-white'
              renderOnZeroPageCount={null as any}
            />
          </div>
        </>
      )}
    </Layout>
  );
}
