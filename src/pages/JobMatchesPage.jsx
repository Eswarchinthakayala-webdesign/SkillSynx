import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Briefcase, 
    MapPin, 
    ExternalLink, 
    Building2, 
    Search,
    Loader2,
    ArrowLeft,
    Globe,
    DollarSign,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import DashboardHeader from '@/components/DashboardHeader';
import puter from '@heyputer/puter.js';

const JobMatchesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { resumeText, analysisResult, jobRole, searchRole: navSearchRole } = location.state || {};

    const [searchRole, setSearchRole] = useState(navSearchRole || jobRole || '');
    const [searchLocation, setSearchLocation] = useState('');
    const [salaryExpectation, setSalaryExpectation] = useState('');
    
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    React.useEffect(() => {
        if (navSearchRole) {
            handleSearch(navSearchRole);
        }
    }, [navSearchRole]);

    const handleSearch = async (overrideRole) => {
        const roleToSearch = typeof overrideRole === 'string' ? overrideRole : searchRole;
        
        setLoading(true);
        setError(null);
        setJobs([]);
        setHasSearched(true);

        try {
            const prompt = `
                You are a sophisticated Career Matchmaker and Recruiter AI.
                Based on the following candidate profile and preferences, identify 6 highly relevant job opportunities.
                
                Candidate Profile:
                - Target Role: ${roleToSearch}
                - Location Preference: ${searchLocation || 'Flexible/Remote'}
                - Salary Expectation: ${salaryExpectation || 'Market Rate'}
                - Key Skills: ${analysisResult?.strengths?.join(', ') || 'General Professional Skills'}
                - Resume Summary: ${analysisResult?.summary || resumeText?.slice(0, 500) || 'Experienced Professional'}...
                
                Task:
                Generate a JSON list of 6 realistic job listings that would be a perfect fit. 
                For the "link", since you cannot browse live real-time listings, construct a valid LinkedIn Job Search URL or Indeed Search URL for that specific title and company.
                
                Return ONLY raw JSON with this structure:
                {
                    "jobs": [
                        {
                            "id": 1,
                            "title": "Job Title",
                            "company": "Company Name (Real, top-tier tech/industry companies)",
                            "location": "Location (Remote/Hybrid/City)",
                            "type": "Full-time/Contract",
                            "salary_range": "$X - $Y",
                            "match_score": 95,
                            "match_reason": "Why this fits the candidate (1 short sentence)",
                            "requirements": ["Skill 1", "Skill 2", "Skill 3"],
                            "posted_date": "2 days ago",
                            "apply_link": "URL"
                        }
                    ]
                }
            `;

            const response = await puter.ai.chat(prompt);
            
            let cleanJson = "";
            if (typeof response === 'string') {
                cleanJson = response;
            } else if (response?.message?.content) {
                cleanJson = response.message.content;
            } else {
                 cleanJson = JSON.stringify(response);
            }

            cleanJson = cleanJson.trim();
            if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '');
            if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/```/g, '').replace(/```/g, '');

            const result = JSON.parse(cleanJson);
            setJobs(result.jobs || []);

        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError("Could not generate job matches at this time. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen max-w-8xl mx-auto text-foreground font-sans">
            <DashboardHeader />

            <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:flex md:items-end md:justify-between mb-10"
                >
                    <div className="max-w-3xl space-y-4">
                        <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-2">
                             AI-Powered Recruiter
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                            Job Intelligence
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl text-balance leading-relaxed">
                            Discover curated career opportunities perfectly matched to your skills, experience, and aspirations.
                        </p>
                    </div>
                </motion.div>

                {/* Refined Search Toolbar */}
                <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="mb-12 sticky top-24 z-30"
                >
                    <div className="bg-[#0B0F1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                         <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-4 space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Target Role</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input 
                                        placeholder="e.g. Product Designer" 
                                        value={searchRole}
                                        onChange={(e) => setSearchRole(e.target.value)}
                                        className="pl-10 h-12 bg-white/5 border-white/10 text-white focus:border-indigo-500/50 focus:bg-white/10 transition-all rounded-xl text-base shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-3 space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <Input 
                                        placeholder="e.g. Remote" 
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                        className="pl-10 h-12 bg-white/5 border-white/10 text-white focus:border-emerald-500/50 focus:bg-white/10 transition-all rounded-xl text-base shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-3 space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Salary</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-500 group-focus-within:text-amber-400 transition-colors" />
                                    <Input 
                                        placeholder="e.g. $120k+" 
                                        value={salaryExpectation}
                                        onChange={(e) => setSalaryExpectation(e.target.value)}
                                        className="pl-10 h-12 bg-white/5 border-white/10 text-white focus:border-amber-500/50 focus:bg-white/10 transition-all rounded-xl text-base shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <Button 
                                    onClick={() => handleSearch()}
                                    disabled={loading || !searchRole}
                                    className="w-full h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl font-semibold text-base"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Find Matches"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 mb-8 max-w-2xl mx-auto">
                        {error}
                    </motion.div>
                )}

                {/* Results Grid */}
                <div className="min-h-[400px]">
                    {loading ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-[360px] bg-white/5 rounded-2xl animate-pulse border border-white/5 p-6 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className="h-14 w-14 rounded-2xl bg-white/10" />
                                        <div className="h-14 w-14 rounded-full bg-white/10" />
                                    </div>
                                    <div className="space-y-2 mt-2">
                                        <div className="h-6 w-3/4 bg-white/10 rounded" />
                                        <div className="h-4 w-1/2 bg-white/10 rounded" />
                                    </div>
                                    <div className="flex-1 rounded-xl bg-white/5 mt-2" />
                                     <div className="h-10 w-full bg-white/10 rounded-xl" />
                                </div>
                            ))}
                         </div>
                    ) : jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job, index) => (
                                <motion.div
                                    key={job.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="group bg-[#131722]/80 backdrop-blur-md border-white/5 hover:border-indigo-500/30 transition-all duration-300 h-full flex flex-col hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                    {job.company.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                     <div className="text-right">
                                                        <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Match</div>
                                                        <div className="text-xl font-bold text-white leading-none">{job.match_score}%</div>
                                                     </div>
                                                     <div className="h-12 w-12 relative flex items-center justify-center">
                                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                            <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                                            <path className="text-emerald-400 drop-shadow-[0_0_2px_rgba(52,211,153,0.8)]" strokeDasharray={`${job.match_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                                                        </div>
                                                     </div>
                                                </div>
                                            </div>
                                            <CardTitle className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[3.5rem] flex items-center tracking-tight">
                                                {job.title}
                                            </CardTitle>
                                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-400 font-medium">
                                                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-indigo-400/70" /> {job.company}</span>
                                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-purple-400/70" /> {job.location}</span>
                                            </div>
                                        </CardHeader>
                                        
                                        <CardContent className="space-y-4 flex-1">
                                            {/* AI Insight Block */}
                                            <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-xl border border-indigo-500/10 relative overflow-hidden group-hover:border-indigo-500/20 transition-colors">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
                                                <p className="text-sm text-indigo-100/90 leading-relaxed relative z-10 italic">
                                                    "{job.match_reason}"
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {job.requirements?.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/5 shadow-sm group-hover:border-white/10 transition-colors">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.requirements?.length > 3 && (
                                                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-gray-500 border border-white/5">
                                                        +{job.requirements.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pt-4 border-t border-white/5 mt-auto flex justify-between items-center bg-black/20 p-5">
                                            <div className="flex items-center gap-1.5 text-white font-semibold">
                                                <span className="text-sm text-muted-foreground mr-1">Pay:</span>
                                                {job.salary_range}
                                            </div>
                                            <Button 
                                                className="bg-white text-black hover:bg-indigo-50 hover:text-indigo-600 px-4 h-9 font-bold text-sm gap-2 transition-all shadow-lg shadow-white/5"
                                                onClick={() => window.open(job.apply_link, '_blank')}
                                            >
                                                Apply <ExternalLink className="w-3.5 h-3.5" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 rounded-3xl bg-[#0B0F1A]/50 backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
                            {/* Decorative background blobs */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] group-hover:bg-indigo-500/30 transition-colors duration-1000" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] group-hover:bg-purple-500/30 transition-colors duration-1000" />
                            
                            <div className="relative z-10 max-w-xl mx-auto p-8">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-8 mx-auto shadow-2xl border border-white/10 rotate-6 group-hover:rotate-12 transition-transform duration-500">
                                    <Briefcase className="w-10 h-10 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Dream Role</span></h2>
                                <p className="text-muted-foreground mb-8 text-lg leading-relaxed text-balance">
                                    Enter your search criteria above. Our AI will analyze your profile against millions of data points to find opportunities where you'll thrive.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default JobMatchesPage;
