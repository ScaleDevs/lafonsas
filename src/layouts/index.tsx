import React from 'react';
import Header from '@/layouts/Header';
import SideNav from './SideNav';

export default function Layout({ children }: any) {
  return (
    <div className='w-full h-screen bg-gray-200 flex flex-row overflow-y-auto scrollbar'>
      <SideNav />
      <div className='flex flex-col h-full w-full overflow-y-auto scrollbar text-black'>
        <Header />
        <div className='w-[95%] mx-auto'>{children}</div>
        <br />
      </div>
    </div>
  );
}
