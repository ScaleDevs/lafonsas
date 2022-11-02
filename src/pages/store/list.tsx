import * as React from 'react';
import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';

export default function ListProducts() {
  const { data, isLoading } = trpc.useQuery(['store.getStores', {}]);

  return (
    <Layout>
      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>List Products</h1>

      <br />
      <br />
      <br />

      <div className='bg-slate-200 shadow-lg px-5 py-10 rounded-md'>
        {isLoading ? (
          <TableLoader />
        ) : (
          <table className='w-full'>
            <thead>
              <tr className='border-gray-500 border-b font-raleway text-xl text-center'>
                <th className='pb-3'>STORE</th>
              </tr>
            </thead>
            <tbody>
              {data
                ? data.records.map(({ id, name }) => (
                    <tr key={id} className='font-comfortaa h-14 text-center'>
                      <td>{name}</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
