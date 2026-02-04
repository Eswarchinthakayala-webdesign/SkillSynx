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
        <div className="min-h-screen bg-[#0B0F1A] text-foreground font-sans">
            <DashboardHeader />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
                >
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(-1)}
                            className="rounded-full hover:bg-white/5"
                        >
                            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-indigo-500" /> Suggested Roles
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Find curated opportunities based on your profile & preferences
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Search Configuration */}
                <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="mb-8"
                >
                    <Card className="bg-[#131722]/60 backdrop-blur-xl border-white/5">
                        <CardHeader>
                            <CardTitle className="text-lg text-white flex items-center gap-2">
                                <Search className="w-4 h-4 text-emerald-400" /> Refine Search
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Target Role</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                        <Input 
                                            placeholder="e.g. Senior Frontend Dev" 
                                            value={searchRole}
                                            onChange={(e) => setSearchRole(e.target.value)}
                                            className="pl-9 bg-black/20 border-white/10 text-white focus:border-indigo-500/50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                        <Input 
                                            placeholder="e.g. Remote, San Francisco" 
                                            value={searchLocation}
                                            onChange={(e) => setSearchLocation(e.target.value)}
                                            className="pl-9 bg-black/20 border-white/10 text-white focus:border-indigo-500/50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Salary Expectations</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                        <Input 
                                            placeholder="e.g. $120k+, Market Rate" 
                                            value={salaryExpectation}
                                            onChange={(e) => setSalaryExpectation(e.target.value)}
                                            className="pl-9 bg-black/20 border-white/10 text-white focus:border-indigo-500/50"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button 
                                onClick={handleSearch}
                                disabled={loading || !searchRole}
                                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning Opportunities...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4 mr-2" /> Find Matching Jobs
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {error && (
                    <div className="text-center py-10 text-red-400 bg-white/5 rounded-xl border border-red-500/20 mb-8">
                        {error}
                    </div>
                )}

                {/* Results Section */}
                <div className="min-h-[400px]">
                    {loading ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-[280px] bg-white/5 rounded-xl animate-pulse border border-white/5 p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 w-2/3">
                                            <div className="h-4 w-12 bg-white/10 rounded" />
                                            <div className="h-6 w-3/4 bg-white/10 rounded" />
                                            <div className="h-4 w-1/2 bg-white/10 rounded" />
                                        </div>
                                        <div className="h-8 w-16 bg-white/10 rounded" />
                                    </div>
                                    <div className="h-20 bg-white/5 rounded border border-white/5" />
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 bg-white/10 rounded-full" />
                                        <div className="h-6 w-16 bg-white/10 rounded-full" />
                                    </div>
                                    <div className="h-10 w-full bg-white/10 rounded mt-auto" />
                                </div>
                            ))}
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {jobs.map((job, index) => (
                                <motion.div
                                    key={job.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="bg-[#131722] border-white/5 hover:border-indigo-500/30 transition-all duration-300 group h-full flex flex-col">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[10px] mb-2 hover:bg-indigo-500/20">
                                                        {job.type}
                                                    </Badge>
                                                    <CardTitle className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                                                        {job.title}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <Building2 className="w-3.5 h-3.5" />
                                                        {job.company}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-xs">
                                                        {job.match_score}% Match
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{job.posted_date}</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4 flex-1">
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                                                    <MapPin className="w-3 h-3" /> {job.location}
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                                                    <Globe className="w-3 h-3" /> Remote/Hybrid
                                                </div>
                                            </div>
                                            
                                            <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                                                <p className="text-xs text-indigo-200/80 leading-relaxed">
                                                    <span className="font-semibold text-indigo-300">Why fits:</span> {job.match_reason}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {job.requirements?.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.requirements?.length > 3 && (
                                                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-500">
                                                        +{job.requirements.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-4 border-t border-white/5 mt-auto">
                                            <div className="w-full flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Salary Range</p>
                                                    <p className="text-sm font-medium text-white">{job.salary_range}</p>
                                                </div>
                                                <Button 
                                                    className="bg-white text-black hover:bg-gray-200 gap-2 shadow-lg shadow-white/5"
                                                    onClick={() => window.open(job.apply_link, '_blank')}
                                                >
                                                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 animate-pulse">
                                <Search className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Ready to Find Your Next Role?</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                Enter your preferred job role, location, and salary expectations above to get personalized job recommendations based on your resume analysis.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> AI-Powered Matching</span>
                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Salary Insights</span>
                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Remote Options</span>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default JobMatchesPage;
