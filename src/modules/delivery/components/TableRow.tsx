import * as React from 'react';
import dayjs from 'dayjs';

export interface ITableRowProps {
  delivery: {
    storeId: string;
    postingDate: Date;
    deliveryNumber: string;
    amount: number;
    id: string;
    paymentId: string | null;
    store: {
      name: string;
    };
  };
  onClick: (deliveryId: string) => void;
}

export default function TableRow({ delivery, onClick }: ITableRowProps) {
  return (
    <tr
      className='h-14 text-left font-comfortaa transition-colors duration-200 hover:cursor-pointer hover:bg-gray-200'
      onClick={() => onClick(delivery.id)}
    >
      <td>{delivery.store.name}</td>
      <td>{delivery.deliveryNumber}</td>
      <td>{dayjs(delivery.postingDate).format('MMM DD, YYYY')}</td>
      <td>₱{delivery.amount}</td>
      <td>
        {!!delivery.paymentId ? (
          <span className='rounded-full bg-green-500 p-2 text-sm'>PAID</span>
        ) : (
          <span className='rounded-full bg-red-500 p-2 text-sm'>UNPAID</span>
        )}
      </td>
    </tr>
  );
}
