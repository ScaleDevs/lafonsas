import { trpc } from '@/utils/trpc';
import * as React from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

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
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
        width={500}
        height={300}
        data={data ?? []}
        margin={{
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='_id' />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey='qty' fill='#6366F1' />
      </BarChart>
    </ResponsiveContainer>
  );
}
