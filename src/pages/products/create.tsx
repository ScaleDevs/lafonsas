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
    name: z.string().min(1, 'Please input product type name!'),
    value: z.string().min(1, 'Please input product type value!'),
    description: z.string().optional().nullable(),
});

type FormSchemaType = z.infer<typeof schema>;

export default function CreateProductType() {
    const { mutate, isLoading, isSuccess, isError } = trpc.useMutation('product.create');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormSchemaType>({
        resolver: zodResolver(schema),
    });

    const createProductType = (formData: FormSchemaType) => {
        mutate(formData, {
            onSuccess() {
                reset({
                    name: '',
                    value: '',
                    description: '',
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
                <title>Product Type | Create</title>
                <meta name='description' content='Create Product Type page' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <ModalLoader open={isLoading}>Saving Product Type ...</ModalLoader>
            <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>Create Product Type</h1>
            <br />
            <form
                className='flex flex-col space-y-4 md:w-[100%] xl:w-[60%] 2xl:w-[800px] bg-white p-8 rounded-md shadow-md overflow-hidden'
                onSubmit={handleSubmit(createProductType)}
            >
                {isSuccess ? (
                    <Notification rounded='sm' type='success' message='Product Type Saved' />
                ) : (
                    ''
                )}
                {isError ? (
                    <Notification rounded='sm' type='error' message='Something went wrong' />
                ) : (
                    ''
                )}
                <TextField
                    required
                    label='Product Type Name'
                    placeholder='enter product type name here'
                    formInput={{ register, property: 'name' }}
                    errorMessage={errors.name?.message}
                    color='secondary'
                />
                <TextField
                    required
                    label='Product Type Value'
                    placeholder='enter product type value here'
                    formInput={{ register, property: 'value' }}
                    errorMessage={errors.value?.message}
                    color='secondary'
                />
                <TextField
                    label='Description'
                    placeholder='enter description here (optional)'
                    formInput={{ register, property: 'description' }}
                    errorMessage={errors.description?.message}
                    color='secondary'
                />
                <Button buttonTitle='SUBMIT' type='submit' />
            </form>
        </Layout>
    );
}
