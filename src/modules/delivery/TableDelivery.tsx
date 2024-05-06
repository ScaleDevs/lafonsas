import { useState } from 'react';
import dayjs from 'dayjs';
import * as exportCsv from 'export-to-csv';

import { trpc } from '@/utils/trpc';
import useDeliveryStoreTrack from '@/store/delivery.store';
import Button from '@/components/Button';
import TableLoader from '@/components/TableLoader';
import Notification from '@/components/Notification';
import TableRow from './components/TableRow';
import ListDeliveryFilter, {
  OnDeliverySearchParams,
} from './components/ListDeliveryFilter';
import Paginator from '@/components/Paginator';
import { PHpeso } from '../utils';

const StoreTag = ({ storeId }: { storeId: string }) => {
  const { data } = trpc.useQuery(['store.getById', storeId]);

  return (
    <div className='text-md rounded-md bg-gray-300 p-3 font-comfortaa'>
      {data?.name}
    </div>
  );
};

export interface ITableDeliveryProps {
  setDeliveryId: (id: string | null) => void;
}

export default function TableDelivery({ setDeliveryId }: ITableDeliveryProps) {
  const {
    deletedDelivery,
    startDate,
    endDate,
    storeId,
    deliveryNumber,
    page,
    setDeliveryState,
  } = useDeliveryStoreTrack();
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const { data, isLoading } = trpc.useQuery([
    'delivery.getDeliveries',
    { limit: 10, page, startDate, endDate, storeId, deliveryNumber },
  ]);

  const { data: exportData, isLoading: fetchingExportData } = trpc.useQuery([
    'delivery.getDeliveries',
    { noLimit: true, page: 1, startDate, endDate, storeId, deliveryNumber },
  ]);

  const handlePageChange = (page: number) => {
    setDeliveryState('page', page);
  };

  const onSearch = ({ date1, date2, storeId, dr }: OnDeliverySearchParams) => {
    setDeliveryState('startDate', date1);
    setDeliveryState('endDate', date2);

    if (storeId === 'ALL') setDeliveryState('storeId', undefined);
    else setDeliveryState('storeId', storeId);

    if (!!dr) setDeliveryState('deliveryNumber', dr);
    else if (!dr || dr === '') setDeliveryState('deliveryNumber', undefined);
    setDeliveryState('page', 1);
    setOpenFilterModal(false);
  };

  const onTableRowClick = (deliveryId: string) => setDeliveryId(deliveryId);

  const exportToCsv = () => {
    if (!exportData?.records) return;

    const csvLib = exportCsv as any;

    const csvConfig = csvLib.mkConfig({
      useKeysAsHeaders: true,
      filename: `deliveries_${startDate}-${endDate}`,
    });
    const dataFeed = exportData.records.map((v) => ({
      store: v.store.name,
      deliveryNumber: v.deliveryNumber,
      postingDate: dayjs(v.postingDate).format('MMM DD, YYYY'),
      amount: PHpeso.format(v.amount),
      paymentStatus: !!v.paymentId ? 'PAID' : 'UNPAID',
    }));
    const csv = csvLib.generateCsv(csvConfig)(dataFeed);
    csvLib.download(csvConfig)(csv);
  };

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
      <h1 className='font-comfortaa text-3xl font-bold md:text-4xl'>
        List Deliveries
      </h1>

      <br />

      <div className='w-[100px]'>
        <Button
          buttonTitle='Filter'
          size='sm'
          onClick={() => setOpenFilterModal(true)}
        />
      </div>

      <br />

      <div className='flex justify-between'>
        <div className='flex space-x-5'>
          {storeId ? (
            <StoreTag storeId={storeId} />
          ) : (
            <div className='text-md rounded-md bg-gray-300 p-3 font-comfortaa'>
              {'ALL STORES'}
            </div>
          )}
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
        <div>
          <Button
            buttonTitle='export'
            size='sm'
            onClick={exportToCsv}
            isLoading={fetchingExportData}
          />
        </div>
      </div>

      <br />

      {!!deletedDelivery ? (
        <>
          <Notification
            rounded='sm'
            type='success'
            message={`Delivery Record: "Delivery Number ${deletedDelivery}" Deleted!`}
          />
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
                <tr className='border-b border-gray-500 text-left font-raleway text-xl'>
                  <th className='pb-3'>Store</th>
                  <th className='pb-3'>DeliveryNumber</th>
                  <th className='pb-3'>PostingDate</th>
                  <th className='pb-3'>Amount</th>
                  <th className='pb-3'>Paid</th>
                </tr>
              </thead>
              <tbody>
                {data
                  ? data.records.map((delivery) => (
                      <TableRow
                        key={delivery.id}
                        delivery={delivery}
                        onClick={onTableRowClick}
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
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
