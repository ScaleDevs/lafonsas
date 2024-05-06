import { useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import dayjs from 'dayjs';
import * as exportCsv from 'export-to-csv';

import { trpc } from '@/utils/trpc';
import { PHpeso } from '@/modules/utils';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import Notification from '@/components/Notification';
import Button from '@/components/Button';
import Paginator from '@/components/Paginator';
import { getEndOfMonth, getStartOfMonth } from '@/utils/helper';
import ListFilter, { PaymentFilterFormSchemaType } from '@/modules/payments/ListFilter';
import PaymentDetails from '@/modules/payments/PaymentDetails';

const initialFilters = {
  refNo: undefined,
  vendor: '',
  startDate: getStartOfMonth('YYYY-MM-DD'),
  endDate: getEndOfMonth('YYYY-MM-DD'),
};

export default function ListPayments() {
  const [stateFilters, setStateFilters] = useState<PaymentFilterFormSchemaType>(initialFilters);
  const [page, setPage] = useState(1);
  const [filterVendorName, setFilterVendorName] = useState('');
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const { data, isLoading, isError, refetch } = trpc.useQuery([
    'payment.getMany',
    {
      limit: 10,
      page,
      refNo: stateFilters.refNo,
      vendor: stateFilters.vendor,
      dateFilters: { startDate: stateFilters.startDate, endDate: stateFilters.endDate },
    },
  ]);

  const {
    data: exportData,
    isLoading: fetchingExportData,
    isError: exportDataError,
  } = trpc.useQuery([
    'payment.getMany',
    {
      noLimit: true,
      page: 1,
      refNo: stateFilters.refNo,
      vendor: stateFilters.vendor,
      dateFilters: { startDate: stateFilters.startDate, endDate: stateFilters.endDate },
    },
  ]);

  const handlePageChange = (page: number, vendorName?: string) => {
    setPage(page);
    setFilterVendorName(vendorName ?? '');
  };

  const onRecordClick = (refNo: string) => {
    router.push(`/payment/?refNo=${refNo}`, undefined, { shallow: true });
  };

  const exportToCsv = () => {
    if (!exportData?.records || !!exportDataError) return;

    const csvLib = exportCsv as any;
    
    const csvConfig = csvLib.mkConfig({
      useKeysAsHeaders: true,
      filename: `payments_${stateFilters.startDate}-${stateFilters.endDate}`,
    });
    const dataFeed = exportData.records.map((v) => ({
      vendor: v.store.name,
      referenceNumber: v.refNo,
      referenceDate: dayjs(v.refDate).format('MMM DD, YYYY'),
      amount: PHpeso.format(v.amount),
    }));
    const csv = csvLib.generateCsv(csvConfig)(dataFeed);
    csvLib.download(csvConfig)(csv);
  };

  return (
    <Layout>
      <Head>
        <title>Store</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {!!router.query.refNo && typeof router.query.refNo === 'string' ? (
        <PaymentDetails referenceNo={router.query.refNo} paymentsRefetch={refetch} />
      ) : (
        <div>
          <ListFilter
            isOpen={openFilterModal}
            closeModal={() => setOpenFilterModal(false)}
            stateFilters={stateFilters}
            setStateFilters={setStateFilters}
            handlePageChange={handlePageChange}
          />

          <h1 className='font-comfortaa text-3xl font-bold md:text-4xl'>Payments</h1>

          <br />
          <div className='w-[100px]'>
            <Button buttonTitle='Filter' size='sm' onClick={() => setOpenFilterModal(true)} />
          </div>

          <br />

          {isError && (
            <>
              <Notification rounded='sm' type='error' message='Something went wrong! Try Again' />
              <br />
            </>
          )}

          <div className='flex justify-between'>
            <div className='flex space-x-5'>
              <div className='text-md rounded-md bg-gray-300 p-3 font-comfortaa'>
                {filterVendorName ? filterVendorName : 'ALL VENDORS'}
              </div>
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

          <div className='overflow-x-auto rounded-md bg-white px-5 py-7 shadow-lg'>
            {isLoading ? (
              <TableLoader />
            ) : (
              <>
                <table className='w-full min-w-[800px]'>
                  <thead>
                    <tr className='border-b border-gray-500 text-center font-raleway text-xl'>
                      <th className='pb-3'>VENDOR</th>
                      <th className='pb-3'>REF NO</th>
                      <th className='pb-3'>REF DATE</th>
                      <th className='pb-3'>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      ? data.records.map((row) => (
                          <tr
                            key={row.refNo}
                            className='h-14 text-center font-comfortaa transition-colors duration-200 hover:cursor-pointer hover:bg-gray-200'
                            onClick={() => onRecordClick(row.refNo)}
                          >
                            <td className='show-modal-ref'>{row.store.name}</td>
                            <td className='show-modal-ref'>{row.refNo}</td>
                            <td className='show-modal-ref'>{dayjs(row.refDate).format('MMM DD, YYYY')}</td>
                            <td className='show-modal-ref'>{PHpeso.format(row.amount)}</td>
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
        </div>
      )}
    </Layout>
  );
}
