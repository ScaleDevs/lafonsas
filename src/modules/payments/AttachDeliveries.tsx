import dayjs from 'dayjs';
import { useFieldArray, Control } from 'react-hook-form';

import FadeIn from '@/components/FadeIn';
import IconComp from '@/components/Icon';
import { trpc } from '@/utils/trpc';
import { PHpeso } from '../utils';

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
    <div className='p-10 shadow-lg'>
      <div className='max-h-[30rem] overflow-y-auto'>
        <h1 className='text-md font-raleway font-semibold md:text-xl'>
          Attach Deliveries : <span className='text-red-500'>*</span>
        </h1>

        <div className='flex flex-row space-x-2'>
          {fields.map((v) => {
            return (
              <div key={v.deliveryId} className='rounded-md bg-gray-300 p-1 px-3'>
                {v.deliveryNumber}
              </div>
            );
          })}
        </div>
        {errorMessage ? <FadeIn cssText='font-raleway text-red-500'>{errorMessage}</FadeIn> : ''}

        <br />

        <table className='w-full'>
          <thead className='sticky'>
            <tr className='text-md sticky top-0 border-b border-gray-500 bg-white text-left font-raleway shadow-lg'>
              <th className='pb-3 font-semibold'>DELIVERY NUMBER</th>
              <th className='pb-3 font-semibold'>POSTING DATE</th>
              <th className='pb-3 font-semibold'>AMOUNT</th>
              <th className='pb-3 font-semibold'>PICKED</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row, index) => {
              const selected = fields.findIndex((v) => v.deliveryId === row.id);

              return (
                <tr
                  key={index}
                  className='h-14 text-left font-comfortaa transition-colors duration-200 hover:cursor-pointer hover:bg-gray-200'
                  onClick={() => {
                    if (selected === -1)
                      append({
                        deliveryId: row.id,
                        deliveryNumber: row.deliveryNumber,
                        postingDate: row.postingDate.toString(),
                        amount: row.amount,
                      });
                    else remove(selected);
                  }}
                >
                  <td>{row.deliveryNumber}</td>
                  <td>{dayjs(row.postingDate).format('MMM DD, YYYY')}</td>
                  <td>{PHpeso.format(row.amount)}</td>
                  <td>
                    {selected !== -1 && (
                      <IconComp iconName='CheckCircleIcon' iconProps={{ fillColor: 'fill-green-700', isButton: false }} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
