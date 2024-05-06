import { trpc } from '@/utils/trpc';
import * as React from 'react';

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
import { PHpeso } from '../utils';

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
  );
}
