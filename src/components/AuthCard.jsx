import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';

const AuthCard = ({ title, subtitle, children, footerLink, footerText }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full max-w-md relative z-10"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-cyan-500/10 rounded-2xl blur-xl" />
      
      <div className="relative bg-background/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden hover:border-white/20 transition-all duration-500">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="p-8">
            <div className="flex justify-center mb-8">
                <Link to="/">
                   <Logo />
                </Link>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{title}</h1>
                <p className="text-muted-foreground text-sm">{subtitle}</p>
            </div>

            {children}
        </div>

        {footerLink && (
            <div className="bg-black/20 p-4 text-center text-sm border-t border-white/5">
                <span className="text-muted-foreground">{footerText} </span>
                <Link to={footerLink} className="text-primary hover:text-indigo-400 font-medium transition-colors">
                    {footerLink === '/login' ? 'Sign in' : 'Create account'}
                </Link>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default AuthCard;
