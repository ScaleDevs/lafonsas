import Head from 'next/head';
import LoginForm from '@/modules/login/LoginForm';
import ForceChangePassword from '@/modules/login/ForceChangePassword';
import useAuthStoreTrack from '@/store/auth.store';

export default function Login() {
  const { forceChangePassword } = useAuthStoreTrack();

  return (
    <div className='bg-gray-200 h-screen flex flex-row justify-center items-center overflow-auto'>
      <Head>
        <title>Login</title>
        <meta name='description' content='Sample Login page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='lg:h-[700px] w-[90%] md:w-[600px] lg:w-[1000px] xl:w-[1200px] bg-gray-400 shadow-lg rounded-lg overflow-hidden font-comfortaa flex flex-row justify-center items-center'>
        <div className='bg-white h-full w-full lg:w-2/4 p-10 text-center text-gray-900'>
          {forceChangePassword ? <ForceChangePassword /> : <LoginForm />}
        </div>
        <div className='h-full w-0 lg:w-2/4 relative flex flex-row justify-center items-center'>
          <img alt='bg login right' src='/lafonsas_bg_2.jpg' className='absolute xl:-top-32' />
        </div>
      </div>
    </div>
  );
}
