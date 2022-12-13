import * as React from 'react';
import dayjs from 'dayjs';
import { Delivery } from '@prisma/client';
import { trpc } from '@/utils/trpc';

export interface ITableRowProps {
  delivery: Omit<
    Delivery,
    'badOrder' | 'widthHoldingTax' | 'otherDeduction' | 'checkNumber' | 'checkDate' | 'orders' | 'returnSlip'
  >;
  onClick: (deliveryId: string) => void;
}

export default function TableRow({ delivery, onClick }: ITableRowProps) {
  const { data } = trpc.useQuery(['store.getById', delivery.storeId]);

  return (
    <tr
      className='font-comfortaa h-14 text-left hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200'
      onClick={() => onClick(delivery.id)}
    >
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
}
