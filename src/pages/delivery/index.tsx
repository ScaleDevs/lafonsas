import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/layouts/index';
import TableDelivery from '@/modules/delivery/TableDelivery';
import DeliveryProfile from '@/modules/delivery/DeliverryProfile';

export default function ListDeliveries() {
  const router = useRouter();
  const [deliveryId, setDeliveryId] = useState<string | null>(null);

  const onSetDeliveryId = (id: string | null) => {
    if (id) router.push(`/delivery/?deliveryId=${id}`, undefined, { shallow: true });
    else router.push(`/delivery`, undefined, { shallow: true });
    setDeliveryId(id);
  };

  useEffect(() => {
    if (router.query.deliveryId) setDeliveryId(router.query.deliveryId as string);
  }, [router.query.deliveryId]);

  return (
    <Layout>
      {deliveryId ? (
        <DeliveryProfile deliveryId={deliveryId} setDeliveryId={onSetDeliveryId} />
      ) : (
        <TableDelivery setDeliveryId={onSetDeliveryId} />
      )}
    </Layout>
  );
}
