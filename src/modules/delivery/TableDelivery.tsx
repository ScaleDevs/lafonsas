import { useState } from 'react';
import ReactPaginate from 'react-paginate';

import { getEndOfMonth, getStartOfMonth } from '@/utils/helper';
import { trpc } from '@/utils/trpc';
import useDeliveryStoreTrack from '@/store/delivery.store';
import Button from '@/components/Button';
import TableLoader from '@/components/TableLoader';
import Notification from '@/components/Notification';
import TableRow from './components/TableRow';
import ListDeliveryFilter, { OnDeliverySearchParams } from './components/ListDeliveryFilter';

export interface ITableDeliveryProps {
  setDeliveryId: (id: string | null) => void;
}

export default function TableDelivery({ setDeliveryId }: ITableDeliveryProps) {
  const { deletedDelivery } = useDeliveryStoreTrack();
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [startDate, setStartDate] = useState(getStartOfMonth());
  const [endDate, setEndDate] = useState(getEndOfMonth());
  const [storeId, setStoreId] = useState<string | undefined>(undefined);
  const [deliveryNumber, setDeliveryNumber] = useState<string | undefined>(undefined);

  const [page, setPage] = useState(1);
  const { data, isLoading } = trpc.useQuery([
    'delivery.getDeliveries',
    { limit: 10, page, startDate, endDate, storeId, deliveryNumber },
  ]);

  const handlePageChange = ({ selected }: { selected: number }) => setPage(selected + 1);

  const onSearch = ({ date1, date2, storeId, dr }: OnDeliverySearchParams) => {
    setStartDate(date1);
    setEndDate(date2);

    if (storeId === 'ALL') setStoreId(undefined);
    else setStoreId(storeId);

    if (!!dr) setDeliveryNumber(dr);
    else if (!dr || dr === '') setDeliveryNumber(undefined);
    setOpenFilterModal(false);
  };

  const onTableRowClick = (deliveryId: string) => setDeliveryId(deliveryId);

  return (
    <div>
      {openFilterModal ? (
        <ListDeliveryFilter
          startDate={startDate}
          endDate={endDate}
          store={storeId}
          deliveryNumber={deliveryNumber}
          closeModal={() => setOpenFilterModal(false)}
          onSearch={onSearch}
        />
      ) : (
        ''
      )}
      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>List Deliveries</h1>

      <br />
      <br />

      <div className='w-[100px]'>
        <Button buttonTitle='Filter' size='sm' onClick={() => setOpenFilterModal(true)} />
      </div>
      <br />

      {!!deletedDelivery ? (
        <>
          <Notification rounded='sm' type='success' message={`Delivery Record: "Delivery Number ${deletedDelivery}" Deleted!`} />
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
                <tr className='border-gray-500 border-b font-raleway text-xl text-left'>
                  <th className='pb-3'>Store</th>
                  <th className='pb-3'>DeliveryNumber</th>
                  <th className='pb-3'>PostingDate</th>
                  <th className='pb-3'>Amount</th>
                  <th className='pb-3'>Paid</th>
                </tr>
              </thead>
              <tbody>
                {data
                  ? data.records.map((delivery) => <TableRow key={delivery.id} delivery={delivery} onClick={onTableRowClick} />)
                  : null}
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
          activeClassName='text-black'
          renderOnZeroPageCount={null as any}
        />
      </div>
    </div>
  );
}
