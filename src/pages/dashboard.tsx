import Head from 'next/head';
import Layout from '@/layouts/index';
import dayjs from 'dayjs';

function Dashboard() {
  return (
    <Layout>
      <Head>
        <title>Dashboard</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <br />

      <div className='flex flex-col space-y-5'>
        <div className='flex w-full flex-col lg:flex-row'>
          <div className='mx-auto h-64 w-[90%] rounded-md bg-gray-300 shadow-lg lg:h-96 lg:w-[55%]'></div>
          <div className='mx-auto mt-5 h-64 w-[90%] rounded-md bg-gray-300 shadow-lg lg:mt-0 lg:h-96 lg:w-[40%]'></div>
        </div>
        <div className='mt-5 flex w-full flex-col lg:flex-row'>
          <div className='mx-auto h-64 w-[90%] rounded-md bg-gray-300 shadow-lg lg:h-96 lg:w-[55%]'></div>
          <div className='mx-auto mt-5 h-64 w-[90%] rounded-md bg-gray-300 shadow-lg lg:mt-0 lg:h-96 lg:w-[40%]'></div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
