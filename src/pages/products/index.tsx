import Head from 'next/head';
import { useRouter } from 'next/router';

import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import Button from '@/components/Button';

export default function ListProductTypes() {
    const router = useRouter();
    const { data, isLoading } = trpc.useQuery(['product.getAll']);

    return (
        <Layout>
            <Head>
                <title>Product Types</title>
                <meta name='description' content='List of Product Types' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className='flex flex-row items-center justify-between'>
                <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>List Product Types</h1>
                <div className='w-40'>
                    <Button
                        size='sm'
                        buttonTitle='CREATE'
                        onClick={() => router.push('/products/create')}
                    />
                </div>
            </div>

            <br />

            <div className='bg-white shadow-lg px-5 py-7 rounded-md'>
                {isLoading ? (
                    <TableLoader />
                ) : (
                    <>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-gray-500 border-b font-raleway text-xl text-center'>
                                    <th className='pb-3'>NAME</th>
                                    <th className='pb-3'>VALUE</th>
                                    <th className='pb-3'>DESCRIPTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.length > 0 ? (
                                    data.map((productType: any) => (
                                        <tr
                                            key={productType.id}
                                            className='font-comfortaa h-14 text-center hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200'
                                        >
                                            <td className='show-modal-ref'>{productType.name}</td>
                                            <td className='show-modal-ref'>{productType.value}</td>
                                            <td className='show-modal-ref'>{productType.description || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className='font-comfortaa h-14 text-center'>
                                        <td className='show-modal-ref text-red-500' colSpan={3}>
                                            NO RECORDS
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </Layout>
    );
}
