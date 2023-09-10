import { useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import dayjs from 'dayjs';

import { trpc } from '@/utils/trpc';
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

  const handlePageChange = (page: number, vendorName?: string) => {
    setPage(page);
    setFilterVendorName(vendorName ?? '');
  };

  const onRecordClick = (refNo: string) => {
    router.push(`/payment/?refNo=${refNo}`, undefined, { shallow: true });
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
        <>
          <ListFilter
            isOpen={openFilterModal}
            closeModal={() => setOpenFilterModal(false)}
            stateFilters={stateFilters}
            setStateFilters={setStateFilters}
            handlePageChange={handlePageChange}
          />

          <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>Payments</h1>

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

          <div className='flex space-x-5'>
            <div className='bg-gray-300 p-3 rounded-md text-md font-comfortaa'>
              {filterVendorName ? filterVendorName : 'ALL VENDORS'}
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

          <div className='bg-white shadow-lg px-5 py-7 rounded-md'>
            {isLoading ? (
              <TableLoader />
            ) : (
              <>
                <table className='w-full'>
                  <thead>
                    <tr className='border-gray-500 border-b font-raleway text-xl text-center'>
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
                            key={row.paymentId}
                            className='font-comfortaa h-14 text-center hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200'
                            onClick={() => onRecordClick(row.refNo)}
                          >
                            <td className='show-modal-ref'>{row.vendor}</td>
                            <td className='show-modal-ref'>{row.refNo}</td>
                            <td className='show-modal-ref'>{dayjs(row.refDate).format('MMM DD, YYYY')}</td>
                            <td className='show-modal-ref'>{row.amount}</td>
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
        </>
      )}
    </Layout>
  );
}
