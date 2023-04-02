import { useState } from 'react';
import Head from 'next/head';
import { AiOutlineDelete } from 'react-icons/ai';
import OutsideClickHandler from 'react-outside-click-handler';

import Notification from '@/components/Notification';
import { trpc } from '@/utils/trpc';
import Layout from '@/layouts/index';
import TableLoader from '@/components/TableLoader';
import InputSolo from '@/components/InputSolo';
import IconComp from '@/components/Icon';
import Button from '@/components/Button';
import Paginator from '@/components/Paginator';
import { capFirstLetters } from '@/modules/utils';
import Modal from '@/components/Modal';
import { Overlay } from '@/components/Overlay';

export default function ListAccounts() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | undefined>(undefined);
  const [searchError, setSearchError] = useState<string | undefined>(undefined);
  const [successDelete, setSuccessDelete] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.useQuery(['account.getMany', { limit: 10, page, accountName }]);
  const { mutate, isLoading: deleteLoading } = trpc.useMutation(['account.delete']);

  const deleteAccount = (accountId: string) => {
    mutate(accountId, {
      onSuccess() {
        refetch();
        setSuccessDelete(true);
        setTimeout(() => {
          setSuccessDelete(false);
        }, 5000);
        setAccountId(null);
      },
    });
  };

  const handlePageChange = (page: number) => setPage(page);

  const handleSearchAccounts = (inputValue: string) => {
    if (!inputValue || inputValue === '' || inputValue.length < 3) {
      setSearchError('Must be at least 3 characters');
      return;
    }

    setSearchError(undefined);
    setAccountName(inputValue);
  };

  const handleSearchAll = () => {
    setSearchError(undefined);
    setAccountName(undefined);
  };

  return (
    <Layout>
      <Head>
        <title>Account</title>
        <meta name='description' content='Accounts page for list of accounts' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {!!accountId && (
        <>
          <Overlay />
          <OutsideClickHandler onOutsideClick={() => setAccountId(null)}>
            <Modal w='w-[400px]' rounded='rounded-sm'>
              <p className='text-red-500'>Are you sure you want to delete account?</p>
              <br />
              <div className='w-[200px] flex flex-row space-x-1'>
                <Button
                  size='sm'
                  buttonTitle='YES'
                  onClick={() => deleteAccount(accountId)}
                  color='red'
                  isLoading={deleteLoading}
                />
                <Button size='sm' buttonTitle='NO' onClick={() => setAccountId(null)} color='blue' isLoading={deleteLoading} />
              </div>
            </Modal>
          </OutsideClickHandler>
        </>
      )}

      <h1 className='text-3xl md:text-4xl font-comfortaa font-bold'>List Accounts</h1>
      <br />

      {successDelete && (
        <>
          <Notification message='Delete Account Successfuly' type='error' />
          <br />
        </>
      )}

      <div className='bg-white shadow-lg px-5 py-7 rounded-md'>
        {isLoading ? (
          <TableLoader />
        ) : (
          <>
            <div className='flex flex-row space-x-2 mb-5 h-10'>
              <InputSolo
                placeholder='Search Account'
                isRow
                w='w-auto md:w-64'
                ButtonChildren={<IconComp iconName='SearchIcon' iconProps={{}} />}
                errMsg={searchError}
                onClick={handleSearchAccounts}
              />
              <div className='w-20'>
                <Button size='sm' buttonTitle='ALL' onClick={handleSearchAll} />
              </div>
            </div>

            <table className='w-full'>
              <thead>
                <tr className='border-gray-500 border-b font-raleway text-xl text-center'>
                  <th className='pb-3'>ACCOUNTS</th>
                </tr>
              </thead>
              <tbody>
                {data
                  ? data.records.map((account) => (
                      <tr
                        key={account.accountId}
                        className='font-comfortaa h-14 text-center hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200'
                      >
                        <td className='show-modal-ref'>{capFirstLetters(account.accountName)}</td>
                        <td className='show-modal-ref'>
                          <AiOutlineDelete
                            className='w-8 h-8 hover:text-red-500'
                            onClick={() => setAccountId(account.accountId)}
                          />
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </>
        )}

        <br />
        <Paginator currentPage={page} pageCount={data?.pageCount || 0} handlePageChange={handlePageChange} />
      </div>
    </Layout>
  );
}
