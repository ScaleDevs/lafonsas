import dayjs from 'dayjs';
import { useFieldArray, Control } from 'react-hook-form';

import FadeIn from '@/components/FadeIn';
import IconComp from '@/components/Icon';
import { trpc } from '@/utils/trpc';

export interface IAttachDeliveriesProps {
  storeId?: string;
  errorMessage?: string;
  control: Control<
    {
      deliveries: {
        amount: number;
        deliveryId: string;
        deliveryNumber: string;
        postingDate: string;
      }[];
      paymentData: {
        modeOfPayment: 'BANK_TRANSFER' | 'CHEQUE' | 'CASH';
        bankName?: string;
        storeId: string;
        refNo: string;
        refDate: string;
        amount: number;
        badOrder: number;
        widthHoldingTax: number;
        otherDeductions: number;
      };
    },
    any
  >;
}

export function AttachDeliveries({ control, errorMessage, storeId }: IAttachDeliveriesProps) {
  const { data } = trpc.useQuery(['delivery.getDeliveriesByStoreId', storeId || ''], {
    enabled: !!storeId,
  });

  const { fields, append, remove } = useFieldArray({
    name: 'deliveries',
    control,
    rules: {
      required: 'Please add an entry',
    },
  });

  return (
    <div className='shadow-lg p-10'>
      <h1 className='text-md md:text-xl font-semibold font-raleway'>
        Attach Deliveries : <span className='text-red-500'>*</span>
      </h1>

      <div className='flex flex-row space-x-2'>
        {fields.map((v) => {
          return (
            <div key={v.deliveryId} className='bg-gray-300 p-1 px-3 rounded-md'>
              {v.deliveryNumber}
            </div>
          );
        })}
      </div>
      {errorMessage ? <FadeIn cssText='font-raleway text-red-500'>{errorMessage}</FadeIn> : ''}

      <br />

      <table className='w-full'>
        <thead>
          <tr className='border-gray-500 border-b font-raleway text-md text-left'>
            <th className='pb-3 font-semibold'>DELIVERY NUMBER</th>
            <th className='pb-3 font-semibold'>POSTING DATE</th>
            <th className='pb-3 font-semibold'>AMOUNT</th>
            <th className='pb-3 font-semibold'>PICKED</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => {
            const isActive = fields.some((v) => v.deliveryId === row.id);
            return (
              <tr
                key={row.deliveryNumber}
                className='font-comfortaa h-14 text-left hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200'
                onClick={() => {
                  if (!isActive)
                    append({
                      deliveryId: row.id,
                      deliveryNumber: row.deliveryNumber,
                      postingDate: row.postingDate.toString(),
                      amount: row.amount,
                    });
                  else remove(index);
                }}
              >
                <td>{row.deliveryNumber}</td>
                <td>{dayjs(row.postingDate).format('MMM DD, YYYY')}</td>
                <td>₱{row.amount}</td>
                <td>
                  {isActive && (
                    <IconComp iconName='CheckCircleIcon' iconProps={{ fillColor: 'fill-green-700', isButton: false }} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
