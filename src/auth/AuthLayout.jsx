import React from 'react';
import { Outlet } from 'react-router-dom';
import Background3D from '@/components/Background3D';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F1A] relative overflow-hidden font-sans">
       {/* 3D Background reused for consistency */}
       <Background3D />

       <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[100px]" />
       </div>

       <div className="relative z-10 w-full flex justify-center p-4">
            <Outlet />
       </div>
    </div>
  );
};

export default AuthLayout;
