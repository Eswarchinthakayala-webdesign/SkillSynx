import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Bell, Search, Menu, Home, FileText, Briefcase, Settings, X, User, ChevronDown, Brain } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"

const DashboardHeader = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    
    // Get initials
    const initials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : 'U';

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: <Home className="w-4 h-4 mr-2" /> },
        { name: 'Analyze Resume', path: '/dashboard/analyzer', icon: <Brain className="w-4 h-4 mr-2" /> },
        { name: 'Resume Library', path: '/dashboard/resumes', icon: <FileText className="w-4 h-4 mr-2" /> },
        { name: 'Job Matches', path: '/dashboard/jobs', icon: <Briefcase className="w-4 h-4 mr-2" /> },
    ];

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl h-20 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
        >
            <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
                {/* Left Side: Logo & Desktop Nav */}
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                        <Logo className="scale-90 origin-left transition-transform group-hover:scale-95 duration-300" />
                    </Link>
                    
                    <nav className="hidden md:flex items-center gap-1 pl-6 border-l border-white/10 h-8">
                         {navItems.map((item) => (
                             <Link 
                                key={item.path}
                                to={item.path} 
                                className="relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center group overflow-hidden"
                            >
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10 rounded-md"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <span className={`relative z-10 flex items-center transition-colors duration-300 ${isActive(item.path) ? "text-white" : "text-muted-foreground group-hover:text-white"}`}>
                                    {isActive(item.path) ? React.cloneElement(item.icon, { className: "w-4 h-4 mr-2 text-primary" }) : item.icon}
                                    {item.name}
                                </span>
                            </Link>
                         ))}
                    </nav>
                </div>

                {/* Right Side: Actions & Profile */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Search Bar - Animated */}
                    <div className="relative hidden md:block transition-all duration-300">
                        <motion.div 
                            animate={{ width: isSearchFocused ? 320 : 256 }}
                            className={`relative flex items-center rounded-xl border transition-all duration-300 ${isSearchFocused ? "border-primary/50 bg-black/40 shadow-[0_0_15px_-3px_rgba(79,70,229,0.3)]" : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"}`}
                        >
                            <Search className={`absolute left-3 w-4 h-4 transition-colors duration-300 ${isSearchFocused ? "text-primary" : "text-muted-foreground"}`} />
                            <Input 
                                placeholder="Search candidates, jobs, or skills..." 
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        navigate('/dashboard/jobs', { state: { searchRole: e.target.value } });
                                    }
                                }}
                                className="pl-10 h-10 bg-transparent border-0 focus-visible:ring-0 text-sm w-full placeholder:text-muted-foreground/50 text-white" 
                            />
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-3 sm:border-l sm:border-white/10 sm:pl-6">


                        <div className="flex items-center gap-3">
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-sm font-medium text-white leading-none tracking-wide">{user?.fullName || user?.username}</span>
                                <span className="text-xs text-muted-foreground mt-1">{user?.email}</span>
                            </div>
                            
                            {/* Profile Dropdown / Actions */}
                            <div className="hidden md:flex items-center gap-2">
                                <Link to="/dashboard/profile">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[1.5px] relative group cursor-pointer shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)] transition-transform hover:scale-105 duration-300">
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-full" />
                                        <div className="h-full w-full rounded-full bg-[#0B0F1A] flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <span className="font-bold text-xs text-white relative z-10">{initials}</span>
                                        </div>
                                    </div>
                                </Link>
                                
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-400 hover:bg-white/5 rounded-full w-9 h-9 transition-colors">
                                            <LogOut className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-[#0B0F1A]/90 backdrop-blur-2xl border border-white/10 text-white shadow-2xl p-0 overflow-hidden gap-0 max-w-sm">
                                        <div className="p-6">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-xl font-bold tracking-tight mb-2">Sign out confirmation</AlertDialogTitle>
                                                <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
                                                    Are you sure you want to sign out? Your session will be terminated.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                        </div>
                                        <div className="p-4 bg-white/5 border-t border-white/5 flex gap-3 justify-end">
                                            <AlertDialogCancel className="bg-transparent border-0 text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction onClick={logout} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg shadow-red-500/20 transition-all">
                                                Sign Out
                                            </AlertDialogAction>
                                        </div>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Menu Trigger (Sheet) */}
                    <Sheet>
                        <SheetTrigger asChild>
                             <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10 rounded-full">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] border-l border-white/10 bg-[#0B0F1A]/95 backdrop-blur-xl p-0 text-white sm:max-w-xs transition-transform duration-500">
                             <div className="flex flex-col h-full">
                                <SheetHeader className="p-6 border-b border-white/10 text-left">
                                     <SheetTitle className="text-left">
                                         <Logo className="scale-90 origin-left" />
                                     </SheetTitle>
                                </SheetHeader>
                                
                                <div className="flex-1 overflow-y-auto py-6 px-4">
                                     <div className="mb-8">
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input 
                                                placeholder="Search..." 
                                                className="pl-10 h-10 bg-white/5 border-white/10 focus:border-primary/50 text-sm rounded-xl transition-all group-focus-within:bg-white/10" 
                                            />
                                        </div>
                                     </div>

                                     <nav className="space-y-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Menu</p>
                                        {navItems.map((item) => (
                                            <SheetClose asChild key={item.path}>
                                                <Link 
                                                    to={item.path} 
                                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                                                        isActive(item.path) 
                                                            ? "bg-gradient-to-r from-primary/20 to-transparent text-primary border-l-2 border-primary" 
                                                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                                                    }`}
                                                >
                                                    {React.cloneElement(item.icon, { className: `w-4 h-4 mr-3 ${isActive(item.path) ? "text-primary" : ""}` })}
                                                    {item.name}
                                                </Link>
                                            </SheetClose>
                                        ))}

                                     </nav>
                                </div>

                                <div className="p-6 border-t border-white/10 bg-black/20">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/10">
                                            <div className="h-full w-full rounded-full bg-[#0B0F1A] flex items-center justify-center">
                                                <span className="font-bold text-sm text-white">{initials}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{user?.fullName}</p>
                                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 shadow-none transition-all hover:scale-[1.02]">
                                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                            </Button>
                                        </AlertDialogTrigger>
                                         <AlertDialogContent className="bg-[#0B0F1A]/90 backdrop-blur-2xl border border-white/10 text-white shadow-2xl p-0 overflow-hidden gap-0 max-w-sm">
                                            <div className="p-6">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-xl font-bold tracking-tight mb-2">Sign out confirmation</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
                                                        Are you sure you want to sign out?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                            </div>
                                            <div className="p-4 bg-white/5 border-t border-white/5 flex gap-3 justify-end">
                                                <AlertDialogCancel className="bg-transparent border-0 text-muted-foreground hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={logout} className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">Sign Out</AlertDialogAction>
                                            </div>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                             </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
};

export default DashboardHeader;
