import Head from 'next/head';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import ModalLoader from '@/components/ModalLoader';
import Notification from '@/components/Notification';
import TextField from '@/components/TextField';
import Button from '@/components/Button';

const schema = z.object({
  accountName: z.string().min(1, 'Please input account name!'),
});

type FormSchemaType = z.infer<typeof schema>;

export default function CreateAccount() {
  const { mutate, isLoading, isSuccess, isError } = trpc.useMutation('account.create');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  });

  const createAccount = (formData: FormSchemaType) => {
    mutate(formData, {
      onSuccess() {
        reset({
          accountName: '',
        });
      },
      onError(err) {
        console.log(err);
      },
    });
  };

  return (
    <Layout>
      <Head>
        <title>Account | Create</title>
        <meta name='description' content='Sample Home page with nextjs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ModalLoader open={isLoading}>Saving Product ...</ModalLoader>
      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>Create Account</h1>
      <br />
      <form
        className='flex flex-col space-y-4 md:w-[100%] xl:w-[60%] 2xl:w-[800px] bg-white p-8 rounded-md shadow-md overflow-hidden'
        onSubmit={handleSubmit(createAccount)}
      >
        {isSuccess ? <Notification rounded='sm' type='success' message='Account Saved' /> : ''}
        {isError ? <Notification rounded='sm' type='error' message='Something went wrong' /> : ''}
        <TextField
          required
          label='Account Name'
          placeholder='enter account name here'
          formInput={{ register, property: 'accountName' }}
          errorMessage={errors.accountName?.message}
          color='secondary'
        />
        <Button buttonTitle='SUBMIT' type='submit' />
      </form>
    </Layout>
  );
}
