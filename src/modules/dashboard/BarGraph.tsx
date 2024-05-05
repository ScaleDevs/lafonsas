import { trpc } from '@/utils/trpc';
import * as React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface IBarGraphProps {
  storeId: string;
  startDate: string;
  endDate: string;
}

export function BarGraph(props: IBarGraphProps) {
  const { data } = trpc.useQuery(['reports.getBarGraphData', { ...props }]);

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='count' fill='#82ca9d' activeBar={<Rectangle fill='gold' stroke='purple' />} />
      </BarChart>
    </ResponsiveContainer>
  );
}
