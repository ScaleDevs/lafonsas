import { trpc } from '@/utils/trpc';
import * as React from 'react';
import dayjs from 'dayjs';
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { mkConfig, generateCsv, download } from 'export-to-csv';

import { PHpeso } from '../utils';
import Button from '@/components/Button';

const COLORS = ['#EF4444', '#F59E0B', '#B91C1C', '#059669'];

export interface ITransactionGraphProps {
  storeId: string;
  startDate: string;
  endDate: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='custom-tooltip rounded-md bg-white p-3 shadow-md'>
        <p className='label'>{`${label} : ${PHpeso.format(
          payload[0].value,
        )}`}</p>
      </div>
    );
  }

  return null;
};

export function TransactionGraph(props: ITransactionGraphProps) {
  const { data, isLoading } = trpc.useQuery([
    'reports.getDeductionsReport',
    { ...props, storeId: props.storeId },
  ]);
  const { data: storeData, isLoading: isFetchingStoreData } = trpc.useQuery([
    'store.getById',
    props.storeId,
  ]);

  const exportToCsv = () => {
    if (!data || !storeData) return;
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: `${storeData?.name}_transactions_${dayjs(
        props.startDate,
      ).format('MM-DD-YYYY')}-${dayjs(props.endDate).format('MM-DD-YYYY')}`,
    });

    const dataFeed = data.map((v) => ({
      TYPE: v.name,
      AMOUNT: PHpeso.format(v.value),
    }));

    const csv = generateCsv(csvConfig)(dataFeed);
    download(csvConfig)(csv);
  };

  if (isLoading)
    return (
      <div className='flex h-full w-full items-center justify-center text-xl font-medium'>
        Loading Data
        <div className='flex flex-row pl-1'>
          <div className='animate-[bounce_0.7s_ease-in-out_-0.3s_infinite] p-[2px] '>
            .
          </div>
          <div className='animate-[bounce_0.7s_ease-in-out_-0.2s_infinite] p-[2px] '>
            .
          </div>
          <div className='animate-[bounce_0.7s_ease-in-out_-0.1s_infinite] p-[2px] '>
            .
          </div>
        </div>
      </div>
    );

  if ((data && data.length === 0) || !data)
    return (
      <div className='flex h-full w-full items-center justify-center text-xl font-medium text-red-500'>
        No Data
      </div>
    );

  return (
    <>
      <div className='flex justify-end pb-5'>
        <div className='max-w-[100px] overflow-hidden rounded-md'>
          <Button
            buttonTitle='export'
            size='sm'
            onClick={exportToCsv}
            isLoading={isLoading || isFetchingStoreData}
          />
        </div>
      </div>

      <ResponsiveContainer width='100%' height='100%'>
        <BarChart width={500} height={300} data={data ?? []}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey='value' fill='#82ca9d'>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
