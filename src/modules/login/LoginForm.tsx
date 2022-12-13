import { useState } from 'react';

import FadeIn from '@/components/FadeIn';
import Loader from '@/components/Loader';
import useLogin from '@/hooks/useLogin.hook';
import IconComp from '@/components/Icon';
import TextField from '@/components/TextField';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { errMessage, handleSubmit, signIn, isSignInLoading, register } = useLogin();

  const toggleShowPass = () => setShowPassword((val) => !val);

  return (
    <div className='lg:pt-32'>
      <h1 className='font-roboto text-4xl pb-6'>SIGN IN</h1>
      {!!errMessage && (
        <>
          <FadeIn>
            <div className='bg-rose-500 rounded-sm p-4 opacity-90 text-center w-full break-words text-white'>{errMessage}</div>
          </FadeIn>
          <br />
        </>
      )}
      <form className='flex flex-col space-y-6 md:w-full' onSubmit={handleSubmit(signIn)}>
        <TextField
          formInput={{ register, property: 'username' }}
          placeholder='enter email'
          size='md'
          color='secondary'
          rounded='lg'
        />

        <div className='w-full relative'>
          <TextField
            formInput={{ register, property: 'password' }}
            type={showPassword ? 'text' : 'password'}
            size='md'
            placeholder='enter password'
            color='secondary'
            rounded='lg'
          />
          {showPassword ? (
            <div
              className='absolute right-0 top-0 bottom-0 mt-auto mb-auto pr-1 mr-1 hover:cursor-pointer h-auto flex flex-row items-center'
              onClick={toggleShowPass}
            >
              <IconComp iconName='EyeCloseIcon' iconProps={{}} />
            </div>
          ) : (
            <div
              className='absolute right-0 top-0 bottom-0 mt-auto mb-auto pr-1 mr-1 hover:cursor-pointer h-auto flex flex-row items-center'
              onClick={toggleShowPass}
            >
              <IconComp iconName='EyeOpenIcon' iconProps={{}} />
            </div>
          )}
        </div>
        <button
          type='submit'
          className='mt-5 bg-primary p-4 w-full rounded-lg hover:bg-primarylight transition-colors duration-300 text-white'
        >
          {isSignInLoading ? <Loader /> : 'SIGN IN'}
        </button>
      </form>
      <h1 className='text-lg font-roboto text-left pt-4'>Forgot Password?</h1>
    </div>
  );
}
