import { useState } from 'react';

import { trpc } from '@/utils/trpc';
import useDeliveryStoreTrack from '@/store/delivery.store';
import Button from '@/components/Button';
import TableLoader from '@/components/TableLoader';
import Notification from '@/components/Notification';
import TableRow from './components/TableRow';
import ListDeliveryFilter, { OnDeliverySearchParams } from './components/ListDeliveryFilter';
import Paginator from '@/components/Paginator';

export interface ITableDeliveryProps {
  setDeliveryId: (id: string | null) => void;
}

export default function TableDelivery({ setDeliveryId }: ITableDeliveryProps) {
  const { deletedDelivery, startDate, endDate, storeId, deliveryNumber, page, setDeliveryState } = useDeliveryStoreTrack();
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const { data, isLoading } = trpc.useQuery([
    'delivery.getDeliveries',
    { limit: 10, page, startDate, endDate, storeId, deliveryNumber },
  ]);

  const handlePageChange1 = (page: number) => {
    setDeliveryState('page', page);
  };

  const onSearch = ({ date1, date2, storeId, dr }: OnDeliverySearchParams) => {
    setDeliveryState('startDate', date1);
    setDeliveryState('endDate', date2);

    if (storeId === 'ALL') setDeliveryState('storeId', undefined);
    else setDeliveryState('storeId', storeId);

    if (!!dr) setDeliveryState('deliveryNumber', dr);
    else if (!dr || dr === '') setDeliveryState('deliveryNumber', undefined);
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

        <Paginator currentPage={page} pageCount={data?.pageCount || 0} handlePageChange={handlePageChange1} />
      </div>
    </div>
  );
}
