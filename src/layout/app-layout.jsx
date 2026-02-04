import React from 'react'

import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import Header from '@/components/Header';

const AppLayout = () => {
    const location = useLocation();
    const isHeaderHidden = ['/login', '/signup', '/dashboard'].includes(location.pathname);

  return (
    <div>
        {!isHeaderHidden && <Header />}
        <main className='min-h-screen w-full'>
            <Toaster position="bottom-right" />
     
         <Outlet/>

        </main>

    </div>
  )
}

export default AppLayout