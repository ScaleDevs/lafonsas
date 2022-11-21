import { trpc } from '@/utils/trpc';
import DeliveryDetailsReport from './DeliveryDetailsReport';

export interface IDeliveryDetailsProps {
  deliveryId: string;
}

export default function DeliveryDetails({ deliveryId }: IDeliveryDetailsProps) {
  const { data } = trpc.useQuery(['delivery.getById', deliveryId]);

  if (!data) return <></>;

  return (
    <div>
      <DeliveryDetailsReport deliveryDetails={data} />
    </div>
  );
}
