import * as React from 'react';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';

import Button from '@/components/Button';
import { trpc } from '@/utils/trpc';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='custom-tooltip rounded-md bg-white p-3 shadow-md'>
        <p className='label'>{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export interface ISKUGraphProps {
  storeId: string;
  startDate: string;
  endDate: string;
}

export function SKUGraph(props: ISKUGraphProps) {
  const { data, isLoading } = trpc.useQuery([
    'reports.getSKUReports',
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
      filename: `${storeData?.name}_sku_${dayjs(props.startDate).format(
        'MM-DD-YYYY',
      )}-${dayjs(props.endDate).format('MM-DD-YYYY')}`,
    });

    const csv = generateCsv(csvConfig)(data);
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
          <XAxis dataKey='_id' />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey='qty' fill='#6366F1' />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
