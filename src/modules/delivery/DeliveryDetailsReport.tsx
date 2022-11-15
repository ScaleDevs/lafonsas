import { useEffect, useState } from 'react';
import { trpc } from '@/utils/trpc';
import { FormSchemaType } from './CreateDeliveryForm';
import Loader from '@/components/Loader';

const displayData = (data: any) => (!data || data === '' ? 'N/A' : data);

const SectionContainer = ({ children }: any) => {
  return <div className='min-w-[96%] sm:min-w-[90%] lg:min-w-[70%] 3xl:min-w-[450px]'>{children}</div>;
};

export type IOrder = {
  size: string;
  quantity: number;
  price: number;
};

export interface IDeliveryDetailsReportProps {
  deliveryDetails: FormSchemaType & { amount: number };
}

export default function DeliveryDetailsReport({ deliveryDetails }: IDeliveryDetailsReportProps) {
  const { data, isLoading } = trpc.useQuery(['store.getById', deliveryDetails.storeId]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [returnSlipTotal, setReturnSlipTotal] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [transformedOrders, setTransformedOrders] = useState<IOrder[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { orders, returnSlip, storeId, badOrder, widthHoldingTax, otherDeduction, ...rest } = deliveryDetails;

  const initializeOrderDetails = () => {
    const newOrderArr: IOrder[] = [];
    let newOrderTotal = 0;
    orders.map((ord) => {
      const price = !!data?.products ? (data.products.find((prd) => prd.size === ord.size)?.price || 0) * ord.quantity : 0;
      newOrderTotal += price;
      newOrderArr.push({ size: ord.size, quantity: ord.quantity, price });
    });
    setOrderTotal(newOrderTotal);
    setTransformedOrders(newOrderArr);
    setTotalDeductions((badOrder || 0) + (widthHoldingTax || 0) + (otherDeduction || 0));
  };

  const initializeReturnSlipDetails = () => {
    let total = 0;
    returnSlip.map((record) => (total += record.price));
    setReturnSlipTotal(total);
  };

  useEffect(() => {
    initializeOrderDetails();
    initializeReturnSlipDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badOrder, data, orders, otherDeduction, widthHoldingTax]);

  if (isLoading)
    return (
      <div className='w-full flex flex-col justify-center items-center space-y-4'>
        <Loader h='h-24' w='w-24' color='fill-slate-700' />
        <h1 className='font-raleway font-bold text-xl'>Loading Data ...</h1>
      </div>
    );

  return (
    <div className='w-full flex flex-col space-y-10 justify-center items-center 3xl:items-start 3xl:space-y-0 3xl:flex-row 3xl:justify-around'>
      <SectionContainer>
        <h1 className='font-bold text-3xl text-center'>Details</h1>
        <ul className='w-full text-sm md:text-lg'>
          {[...Object.entries(rest), ['Store', data?.name]].map((record) => (
            <li key={record[0]} className='w-full text-center flex flex-row justify-between border-b border-zinc-600 py-2'>
              <div className='font-bold text-left'>{record[0]}:</div>{' '}
              <span className='text-right min-w-[100px]'>{displayData(record[1])}</span>
            </li>
          ))}
        </ul>
      </SectionContainer>

      <SectionContainer>
        <h1 className='font-bold text-3xl text-center pb-2'>Orders</h1>
        <table className='w-full text-sm md:text-lg'>
          <thead>
            <tr className='border-zinc-600 border-b font-bold text-left'>
              <th className='pb-3'>Size</th>
              <th className='pb-3'>Quantity</th>
              <th className='pb-3'>Price</th>
            </tr>
          </thead>
          <tbody>
            {transformedOrders.map((ord, i) => (
              <tr key={i} className='font-comfortaa h-8 text-center border-b border-zinc-600'>
                <td className='text-left'>{ord.size}</td>
                <td className='text-left'>{ord.quantity}</td>
                <td className='text-left'>{ord.price}</td>
              </tr>
            ))}
            <tr className='font-comfortaa h-8 text-center border-b border-zinc-600'>
              <td className='text-left'></td>
              <td className='text-left font-bold'>ORDER TOTAL</td>
              <td className='text-left font-bold text-blue-500'>{orderTotal}</td>
            </tr>
            <tr className='font-comfortaa h-8 text-center border-b border-zinc-600'>
              <td className='text-center font-bold text-lg' colSpan={3}>
                DEDUCTIONS
              </td>
            </tr>
            {[
              { label: 'BAD ORDER', value: badOrder },
              { label: 'WIDTHOLDING TAX', value: widthHoldingTax },
              { label: 'OTHER DEDUCTIONS', value: otherDeduction },
            ].map((record) => (
              <tr key={record.label} className='font-comfortaa h-8 text-center border-b border-zinc-600'>
                <td className='text-left'>{record.label}</td>
                <td className='text-left'></td>
                <td className='text-left'>{record.value}</td>
              </tr>
            ))}
            <tr className='font-comfortaa h-8 text-center border-b border-zinc-600'>
              <td className='text-left'></td>
              <td className='text-left font-bold'>TOTAL</td>
              <td className='text-left font-bold text-blue-500'>{orderTotal - totalDeductions}</td>
            </tr>
          </tbody>
        </table>
      </SectionContainer>

      <SectionContainer>
        <h1 className='font-bold text-3xl text-center pb-2'>Return Slip</h1>
        <table className='w-full text-sm md:text-lg'>
          <thead>
            <tr className='border-zinc-600 border-b font-bold text-left'>
              <th className='pb-3'>Size</th>
              <th className='pb-3'>Quantity</th>
              <th className='pb-3'>Price</th>
            </tr>
          </thead>
          <tbody>
            {returnSlip.map((record, i) => (
              <tr key={i} className='font-comfortaa h-8 text-center border-b border-zinc-600'>
                <td className='text-left'>{record.size}</td>
                <td className='text-left'>{record.quantity}</td>
                <td className='text-left'>{record.price}</td>
              </tr>
            ))}
            <tr className='font-comfortaa h-8 text-center border-b border-zinc-600'>
              <td className='text-left'></td>
              <td className='text-left font-bold'>TOTAL</td>
              <td className='text-left font-bold text-blue-500'>{returnSlipTotal}</td>
            </tr>
          </tbody>
        </table>
      </SectionContainer>
    </div>
  );
}
