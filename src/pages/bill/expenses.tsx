import { useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import dayjs from 'dayjs';
import { mkConfig, generateCsv, download } from 'export-to-csv';

import { trpc } from '@/utils/trpc';
import { getStartOfMonth, getEndOfMonth } from '@/utils/helper';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import Notification from '@/components/Notification';
import Button from '@/components/Button';
import ListFilter, { FormSchemaType } from '@/modules/bill/ListFilter.expenses';
import Paginator from '@/components/Paginator';
import { capFirstLetters, PHpeso } from '@/modules/utils';

const initialFilters = {
  accountId: undefined,
  startDate: getStartOfMonth('YYYY-MM-DD'),
  endDate: getEndOfMonth('YYYY-MM-DD'),
};

export default function ListExpenses() {
  const [filterModal, setFilterModal] = useState(false);
  const [stateFilters, setStateFilters] = useState<FormSchemaType>(initialFilters);
  const [accountName, setAccountName] = useState('ALL ACCOUNTS');
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = trpc.useQuery([
    'expense.getMany',
    {
      limit: 10,
      page,
      dateFilters: {
        startDate: stateFilters.startDate,
        endDate: stateFilters.endDate,
      },
      accountId: stateFilters.accountId,
    },
  ]);

  const {
    data: exportData,
    isLoading: fetchingExportData,
    isError: exportDataError,
  } = trpc.useQuery([
    'expense.getMany',
    {
      noLimit: true,
      page: 1,
      dateFilters: {
        startDate: stateFilters.startDate,
        endDate: stateFilters.endDate,
      },
      accountId: stateFilters.accountId,
    },
  ]);

  const onRecordClick = (invoiceRefNo: string) => {
    router.push(`/bill/?refNo=${invoiceRefNo}`, undefined, { shallow: true });
  };

  const handlePageChange = (page: number) => setPage(page);

  const exportToCsv = () => {
    if (!exportData?.records || exportDataError) return;
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: `expenses_${stateFilters.startDate}-${stateFilters.endDate}`,
    });
    const dataFeed = exportData.records.map((v) => ({
      account: capFirstLetters(v.accountName),
      date: dayjs(v.date).format('MMM DD, YYYY'),
      amount: PHpeso.format(v.amount),
      description: v.description,
    }));
    const csv = generateCsv(csvConfig)(dataFeed);
    download(csvConfig)(csv);
  };

  return (
    <Layout>
      <Head>
        <title>Expenses</title>
        <meta name='description' content='lafonsas expenses list page' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ListFilter
        isOpen={filterModal}
        closeModal={() => setFilterModal(false)}
        stateFilters={stateFilters}
        setStateFilters={setStateFilters}
        setAccountName={setAccountName}
        handlePageChange={handlePageChange}
      />
      <h1 className='font-comfortaa text-3xl font-bold md:text-4xl'>List Expenses</h1>

      <br />
      <br />
      <br />
      <div className='w-[100px]'>
        <Button buttonTitle='Filter' size='sm' onClick={() => setFilterModal(true)} />
      </div>

      <br />
      <div className='flex justify-between'>
        <div className='flex space-x-5'>
          <div className='text-md rounded-md bg-gray-300 p-3 font-comfortaa'>{capFirstLetters(accountName)}</div>
          <div className='flex'>
            <div className='text-md rounded-md bg-gray-300 p-3 font-comfortaa'>
              {dayjs(stateFilters.startDate).format('MMM DD, YYYY')}
            </div>
            <div className='flex items-center px-3'>-</div>
            <div className='text-md rounded-md bg-gray-300 p-3 font-comfortaa'>
              {dayjs(stateFilters.endDate).format('MMM DD, YYYY')}
            </div>
          </div>
        </div>
        <div>
          <Button buttonTitle='export' size='sm' onClick={exportToCsv} isLoading={fetchingExportData} />
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

      <div className='overflow-x-auto rounded-md bg-white px-5 py-7 shadow-lg'>
        {isLoading ? (
          <TableLoader />
        ) : (
          <>
            <table className='w-full min-w-[800px]'>
              <thead>
                <tr className='border-b border-gray-500 text-center font-raleway text-xl'>
                  <th className='pb-3'>ACCOUNT</th>
                  <th className='pb-3'>DATE</th>
                  <th className='pb-3'>AMOUNT</th>
                  <th className='pb-3'>DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                {data ? (
                  data.records.length === 0 ? (
                    <tr className='h-14 text-center font-comfortaa'>
                      <td className='show-modal-ref text-red-500' colSpan={4}>
                        NO RECORD
                      </td>
                    </tr>
                  ) : (
                    data.records.map((expense) => (
                      <tr
                        key={expense.expenseId}
                        className='h-14 text-center font-comfortaa transition-colors duration-200 hover:cursor-pointer hover:bg-gray-300'
                        onClick={() => onRecordClick(expense.billInvoiceRefNo)}
                      >
                        <td className='show-modal-ref'>{capFirstLetters(expense.accountName)}</td>
                        <td className='show-modal-ref'>{dayjs(expense.date).format('MMM DD, YYYY')}</td>
                        <td className='show-modal-ref'>{PHpeso.format(expense.amount)}</td>
                        <td className='show-modal-ref'>{expense.description}</td>
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
    </Layout>
  );
}
