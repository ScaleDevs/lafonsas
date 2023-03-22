import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/layouts/index';
import TableDelivery from '@/modules/delivery/TableDelivery';
import DeliveryProfile from '@/modules/delivery/DeliverryProfile';
import useDeliveryStoreTrack from '@/store/delivery.store';

export default function ListDeliveries() {
  const router = useRouter();
  const { resetDeliveryState } = useDeliveryStoreTrack();
  const [deliveryId, setDeliveryId] = useState<string | null>(null);

  const onSetDeliveryId = (id: string | null) => {
    if (id) router.push(`/delivery/?deliveryId=${id}`, undefined, { shallow: true });
    else router.push(`/delivery`, undefined, { shallow: true });
    setDeliveryId(id);
  };

  useEffect(() => {
    if (router.query.deliveryId) setDeliveryId(router.query.deliveryId as string);
  }, [router.query.deliveryId]);

  useEffect(() => {
    return () => resetDeliveryState();
  }, [resetDeliveryState]);

  return (
    <Layout>
      <Head>
        <title>Delivery</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {deliveryId ? (
        <DeliveryProfile deliveryId={deliveryId} setDeliveryId={onSetDeliveryId} />
      ) : (
        <TableDelivery setDeliveryId={onSetDeliveryId} />
      )}
    </Layout>
  );
}
