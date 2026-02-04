import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import { 
    Brain, 
    FileText, 
    Briefcase, 
    ArrowRight, 
    Sparkles, 
    Target,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen text-foreground font-sans selection:bg-indigo-500/30">
            <DashboardHeader />
            
            <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-10"
                >
                    {/* Welcome Section */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{user?.fullName?.split(' ')[0] || 'User'}</span>.
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Ready to accelerate your career? Your AI-powered workspace is prepped and ready.
                        </p>
                    </motion.div>

                    {/* Quick Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Analyzer Card */}
                        <motion.div variants={itemVariants} className="group h-full">
                            <Card className="bg-[#131722]/60 backdrop-blur-xl border-white/5 hover:border-indigo-500/50 transition-all duration-500 h-full relative overflow-hidden group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]">
                                <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all" />
                                <CardHeader className="relative z-10 pb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                                        <Brain className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <CardTitle className="text-xl text-white">AI Resume Analyzer</CardTitle>
                                    <CardDescription className="text-gray-400 text-sm mt-1">
                                        Get instant ATS scores, skill gap analysis, and tailored improvement suggestions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="relative z-10 pt-0 mt-auto">
                                    <Button 
                                        className="w-full bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-transparent transition-all duration-300 group/btn"
                                        onClick={() => navigate('/dashboard/analyzer')}
                                    >
                                        Analyze Resume <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Resume Library Card */}
                        <motion.div variants={itemVariants} className="group h-full">
                            <Card className="bg-[#131722]/60 backdrop-blur-xl border-white/5 hover:border-emerald-500/50 transition-all duration-500 h-full relative overflow-hidden group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]">
                                <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all" />
                                <CardHeader className="relative z-10 pb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                                        <FileText className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <CardTitle className="text-xl text-white">Resume Library</CardTitle>
                                    <CardDescription className="text-gray-400 text-sm mt-1">
                                        Explore hundreds of successful resume examples to gather inspiration.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="relative z-10 pt-0 mt-auto">
                                    <Button 
                                        className="w-full bg-emerald-600/10 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/20 hover:border-transparent transition-all duration-300 group/btn"
                                        onClick={() => navigate('/dashboard/resumes')}
                                    >
                                        Browse Library <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Job Matches Card */}
                        <motion.div variants={itemVariants} className="group h-full">
                            <Card className="bg-[#131722]/60 backdrop-blur-xl border-white/5 hover:border-amber-500/50 transition-all duration-500 h-full relative overflow-hidden group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]">
                                <div className="absolute top-0 right-0 p-32 bg-amber-500/10 blur-[100px] rounded-full group-hover:bg-amber-500/20 transition-all" />
                                <CardHeader className="relative z-10 pb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4 border border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                                        <Briefcase className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <CardTitle className="text-xl text-white">Smart Job Search</CardTitle>
                                    <CardDescription className="text-gray-400 text-sm mt-1">
                                        Find opportunities perfectly matched to your skills and preferences.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="relative z-10 pt-0 mt-auto">
                                    <Button 
                                        className="w-full bg-amber-600/10 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/20 hover:border-transparent transition-all duration-300 group/btn"
                                        onClick={() => navigate('/dashboard/jobs')}
                                    >
                                        Find Matches <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Pro Tips / Stats Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants} className="h-full">
                            <Card className="bg-gradient-to-br from-[#1A1F2E] to-[#131722] border-white/5 h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-white">
                                        <Zap className="w-5 h-5 text-yellow-500" /> Pro Tips
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                            <span className="font-bold text-indigo-400 text-xs">1</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-white">Tailor to every job</h4>
                                            <p className="text-xs text-muted-foreground mt-1">Use the Resume Analyzer for each application to ensure high ATS compatibility.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                            <span className="font-bold text-emerald-400 text-xs">2</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-white">Quantify your impact</h4>
                                            <p className="text-xs text-muted-foreground mt-1">Use numbers and percentages in your resume experience section.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants} className="h-full">
                            <Card className="bg-gradient-to-br from-[#1A1F2E] to-[#131722] border-white/5 h-full flex flex-col justify-center text-center p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
                                        <Target className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Track Your Progress</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                                        You're on the right path. Consistent optimization increases interview chances by 300%.
                                    </p>
                                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => navigate('/dashboard/profile')}>
                                        View Profile
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
