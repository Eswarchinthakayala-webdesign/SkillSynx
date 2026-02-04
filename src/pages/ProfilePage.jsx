import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  User, 
  CreditCard, 
  Shield, 
  Activity, 
  Cpu, 
  Zap,
  Clock,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import { puter } from '@heyputer/puter.js';
import AntiGravity from '@/components/ui/AntiGravity';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

const ProfilePage = () => {
    const { user } = useAuth(); // We still use context for basic user info if needed, but we'll fetch details
    const [loading, setLoading] = useState(true);
    const [usageData, setUsageData] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [appUsage, setAppUsage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch User and Monthly Usage first
                const [userRes, usageRes] = await Promise.all([
                    puter.auth.getUser(),
                    puter.auth.getMonthlyUsage()
                ]);
                
                setUserDetails(userRes);
                setUsageData(usageRes);

                // Fetch detailed app usage if app_uid is available
                const appId = userRes?.app_uid || userRes?.app_name;
                if (appId) {
                    try {
                        const appUsageRes = await puter.auth.getDetailedAppUsage(appId);
                        setAppUsage(appUsageRes);
                    } catch (err) {
                        console.warn("Failed to fetch detailed app usage:", err);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading profile data...</p>
                </div>
            </div>
        );
    }
    
    // Process Chart Data
    // We need to robustly handle missing keys or empty data
    const pieData = usageData?.usage ? Object.entries(usageData.usage)
        .filter(([key]) => key !== 'total')
        .map(([key, data]) => ({
            name: key.split(':').pop().replace(/_/g, ' '),
            value: data.cost
        }))
        .filter(item => item.value > 0)
        .slice(0, 5) // Limit to top 5 for pies to avoid clutter
        : [];

    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0B0F1A]/95 p-4 rounded-xl border border-white/10 shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <p className="font-medium text-white mb-2">{label || payload[0].name}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                             <span className="text-muted-foreground">{entry.name}:</span>
                             <span className="font-mono text-white font-bold">
                                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                             </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };


    const barData = usageData?.usage ? Object.entries(usageData.usage)
        .filter(([key]) => key !== 'total')
        .map(([key, data]) => ({
            name: key.split(':').pop().replace(/_/g, ' '),
            count: data.count
        }))
        .filter(item => item.count > 0)
        .slice(0, 5)
        : [];

    return (
        <div className="min-h-screen text-foreground font-sans selection:bg-primary/30">
            <DashboardHeader />
            
            <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-6 md:items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
                        <p className="text-muted-foreground mt-1">Manage your profile, usage, and billing details.</p>
                    </div>

                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: User Profile */}
                    <motion.div 
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.5, delay: 0.1 }}
                         className="space-y-6"
                    >
                        <Card className="bg-[#131722]/50 backdrop-blur-xl border-white/5 overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 relative">
                                <div className="absolute inset-0 bg-grid-white/[0.02]" />
                            </div>
                            <div className="px-6 relative">
                                <div className="h-20 w-20 rounded-full bg-[#0B0F1A] p-1 absolute -top-10 shadow-xl">
                                    <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                                        {(user?.fullName || userDetails?.username || 'U')[0]?.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-12 mt-2 space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{user?.fullName || user?.username || 'User'}</h2>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4" /> Username</span>
                                        <span className="text-white font-mono">{user?.fullName || user?.username}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2"><Shield className="w-4 h-4" /> UUID</span>
                                        <span className="text-white font-mono text-xs" title={userDetails?.uuid}>
                                            {userDetails?.uuid?.substring(0, 12)}...
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Last Active</span>
                                        <span className="text-white">
                                            {userDetails?.last_activity_ts ? new Date(userDetails.last_activity_ts * 1000).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Status</span>
                                        <span className={userDetails?.email_confirmed ? "text-emerald-400" : "text-yellow-400"}>
                                            {userDetails?.email_confirmed ? "Verified" : "Unverified"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Feature Flags / Meta from User Details */}
                        {userDetails?.feature_flags && (
                            <Card className="bg-[#131722]/50 backdrop-blur-xl border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-base text-white">Account Features</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-3">
                                    {Object.entries(userDetails.feature_flags).map(([key, value]) => (
                                        <div key={key} className="bg-white/5 rounded-lg p-3 border border-white/5 flex flex-col gap-1">
                                            <span className="text-[10px] text-muted-foreground uppercase break-words">{key.replace(/-/g, ' ')}</span>
                                            <span className={`text-sm font-bold ${value ? "text-emerald-400" : "text-white/50"}`}>
                                                {value ? "Enabled" : "Disabled"}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>

                    {/* Right Column: Usage & Analytics */}
                    <motion.div 
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.5, delay: 0.2 }}
                         className="lg:col-span-2 space-y-6"
                    >
                        {/* Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <AntiGravity duration={6} delay={0}>
                                <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20">
                                    <CardHeader className="min-h-[100px] flex flex-col justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-indigo-300">Total Usage Cost</CardTitle>
                                        <div className="text-3xl font-bold text-white">
                                            {(usageData?.usage?.total || 0).toLocaleString()}
                                        </div>
                                        <div className="flex items-center text-xs text-indigo-400/70">
                                            <CreditCard className="w-3 h-3 mr-1" /> Estimated Credits
                                        </div>
                                    </CardHeader>
                                </Card>
                            </AntiGravity>
                            
                            <AntiGravity duration={7} delay={1}>
                                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                                    <CardHeader className="min-h-[100px] flex flex-col justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-purple-300">Remaining Allowance</CardTitle>
                                        <div className="text-3xl font-bold text-white">
                                            {usageData?.allowanceInfo ? 
                                                ((usageData.allowanceInfo.remaining / usageData.allowanceInfo.monthUsageAllowance) * 100).toFixed(1) 
                                                : 0}%
                                        </div>
                                         <div className="flex items-center text-xs text-purple-400/70">
                                            <Zap className="w-3 h-3 mr-1" /> of Monthly Limit
                                        </div>
                                    </CardHeader>
                                </Card>
                            </AntiGravity>

                            <AntiGravity duration={8} delay={2}>
                                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                                    <CardHeader className="min-h-[100px] flex flex-col justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-emerald-300">Active Apps</CardTitle>
                                        <div className="text-3xl font-bold text-white">
                                            {usageData?.appTotals ? Object.keys(usageData.appTotals).length : 0}
                                        </div>
                                         <div className="flex items-center text-xs text-emerald-400/70">
                                            <Cpu className="w-3 h-3 mr-1" /> Running Instances
                                        </div>
                                    </CardHeader>
                                </Card>
                            </AntiGravity>
                        </div>

                        {/* Charts Section */}
                        {pieData.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-[#131722]/50 backdrop-blur-xl border-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-white text-base">Cost Distribution</CardTitle>
                                        <CardDescription>Breakdown of resource consumption.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius="55%"
                                                    outerRadius="75%"
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                        </ResponsiveContainer>
                                        <div className="flex flex-wrap justify-center gap-4  text-xs text-muted-foreground ">
                                            {pieData.map((entry, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    {entry.name}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-[#131722]/50 backdrop-blur-xl border-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-white text-base">Request Volume</CardTitle>
                                        <CardDescription>Number of operations per category.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                                <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32}>
                                                     {barData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                         {usageData?.usage && (
                            <Card className="bg-[#131722]/50 backdrop-blur-xl border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-white text-base">Detailed Resource Log</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(usageData.usage).filter(([key]) => key !== 'total').map(([key, data], i) => (
                                            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-lg bg-${COLORS[i % COLORS.length]}/20 text-${COLORS[i % COLORS.length]}`}>
                                                        <Activity className="w-5 h-5" style={{ color: COLORS[i % COLORS.length] }} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white text-sm">{key.split(':').pop().replace(/_/g, ' ')}</p>
                                                        <p className="text-xs text-muted-foreground">{key.split(':')[0]}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-white font-mono">{data.cost ? data.cost.toLocaleString() : 0}</div>
                                                    <div className="text-xs text-muted-foreground">{data.count} ops</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                         )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
