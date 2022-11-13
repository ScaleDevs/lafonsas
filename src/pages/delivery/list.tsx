import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import dayjs from 'dayjs';

import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import { getStartOfMonth, getEndOfMonth } from '@/utils/helper';
import { Delivery } from '@prisma/client';

interface TableRowProps {
  delivery: Delivery;
}

const TableRow = ({ delivery }: TableRowProps) => {
  const { data } = trpc.useQuery(['store.getById', delivery.storeId]);

  return (
    <tr className='font-comfortaa h-14 text-left hover:cursor-pointer hover:bg-gray-700 transition-colors duration-200'>
      <td>{data?.name}</td>
      <td>{delivery.deliveryNumber}</td>
      <td>{dayjs(delivery.postingDate).format('MMM DD, YYYY')}</td>
      <td>₱{delivery.amount}</td>
      <td>
        {!!delivery.amountPaid && delivery.amountPaid > 0 ? (
          <span className='bg-green-500 p-2 rounded-full text-sm'>PAID</span>
        ) : (
          <span className='bg-red-500 p-2 rounded-full text-sm'>UNPAID</span>
        )}
      </td>
    </tr>
  );
};

export default function ListProducts() {
  const [startDate, setStartDate] = useState(getStartOfMonth());
  const [endDate, setEndDate] = useState(getEndOfMonth());
  const [page, setPage] = useState(1);
  const { data, isLoading } = trpc.useQuery(['delivery.getDeliveriesByDate', { limit: 10, page, startDate, endDate }]);

  const handlePageChange = ({ selected }: { selected: number }) => setPage(selected + 1);
  return (
    <Layout>
      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>List Deliveries</h1>

      <br />
      <br />
      <br />

      <div className='bg-zinc-900 shadow-lg px-5 py-7 rounded-md'>
        {isLoading ? (
          <TableLoader />
        ) : (
          <>
            <table className='w-full'>
              <thead>
                <tr className='border-gray-500 border-b font-raleway text-xl text-left'>
                  <th className='pb-3'>Store</th>
                  <th className='pb-3'>DeliveryNumber</th>
                  <th className='pb-3'>PostingDate</th>
                  <th className='pb-3'>Amount</th>
                  <th className='pb-3'>Paid</th>
                </tr>
              </thead>
              <tbody>{data ? data.records.map((delivery) => <TableRow key={delivery.id} delivery={delivery} />) : null}</tbody>
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
          activeClassName='text-blue-400'
          renderOnZeroPageCount={null as any}
        />
      </div>
    </Layout>
  );
}
