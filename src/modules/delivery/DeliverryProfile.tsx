import { trpc } from '@/utils/trpc';
import DeliveryDetailsReport from './DeliveryDetailsReport';
import Button from '@/components/Button';

export interface IDeliveryProfileProps {
  deliveryId: string;
  setDeliveryId: (id: string | null) => void;
}

export default function DeliveryProfile({ deliveryId, setDeliveryId }: IDeliveryProfileProps) {
  const { data, isLoading } = trpc.useQuery(['delivery.getById', deliveryId]);

  const handlBackButton = () => setDeliveryId(null);

  if (isLoading || !data) return <></>;

  return (
    <div className='bg-zinc-900 shadow-lg px-5 py-7 rounded-md'>
      <div className='flex flex-row justify-between'>
        <div className='w-24'>
          <Button buttonTitle='Back' size='sm' onClick={handlBackButton} />
        </div>
        <div className='flex flex-row space-x-2'>
          <div className='w-24'>
            <Button buttonTitle='Edit' size='sm' />
          </div>
          <div className='w-24'>
            <Button buttonTitle='Delete' size='sm' color='red' />
          </div>
        </div>
      </div>
      <DeliveryDetailsReport deliveryDetails={data} />
    </div>
  );
}
