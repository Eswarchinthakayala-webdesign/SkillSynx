import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Download, 
    Search, 
    Loader2,
    Database,
    FileText,
    User,
    ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardHeader from '@/components/DashboardHeader';
import { Badge } from '@/components/ui/badge';

const RESUMES_REPO_API = 'https://api.github.com/repos/jsonresume/jsonresume-fake/contents/resumes';
const RAW_URL_BASE = 'https://raw.githubusercontent.com/jsonresume/jsonresume-fake/master/resumes';

const ResumesPage = () => {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(24);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const response = await fetch(RESUMES_REPO_API);
            if (!response.ok) throw new Error('Failed to fetch resumes');
            const data = await response.json();
            const jsonFiles = data.filter(file => file.name.endsWith('.json'));
            setResumes(jsonFiles);
        } catch (error) {
            console.error("Error fetching resumes:", error);
            setResumes(Array.from({ length: 10 }).map((_, i) => ({
                name: `sample-resume-${i+1}.json`,
                size: 2048,
                download_url: '#'
            })));
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadJson = (resume) => {
        const url = resume.download_url || `${RAW_URL_BASE}/${resume.name}`;
        window.open(url, '_blank');
    };

    const formatName = (fileName) => {
        return fileName
            .replace('.json', '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    const filteredResumes = resumes.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const visibleResumes = filteredResumes.slice(0, displayCount);

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 24);
    };

    // Mini Resume ID Card Component
    const ResumeThumbnail = ({ name }) => (
        <div className="aspect-[1/1.41] bg-white w-full rounded-sm p-4 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 shadow-sm border border-gray-100">
            {/* Header Mock */}
            <div className="flex gap-3 mb-4 items-center border-b border-gray-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 shrink-0 flex items-center justify-center text-emerald-600 font-bold text-xs border border-emerald-100">
                    {name.charAt(0)}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="h-2.5 bg-gray-800 w-3/4 rounded-sm opacity-80" />
                    <div className="h-2 bg-gray-300 w-1/2 rounded-sm" />
                </div>
            </div>
            
            {/* Body Mock lines */}
            <div className="space-y-3 opacity-60">
                <div className="flex gap-2">
                    <div className="w-1/4 h-2 bg-emerald-100/50 rounded-sm" />
                    <div className="w-3/4 h-2 bg-gray-200 rounded-sm" />
                </div>
                <div className="h-1.5 bg-gray-100 w-full rounded-sm" />
                <div className="h-1.5 bg-gray-100 w-11/12 rounded-sm" />
                <div className="h-1.5 bg-gray-100 w-full rounded-sm" />
                
                <div className="pt-2">
                     <div className="w-1/3 h-2 bg-gray-300 rounded-sm mb-1.5" />
                     <div className="h-1.5 bg-gray-100 w-full rounded-sm" />
                     <div className="h-1.5 bg-gray-100 w-4/5 rounded-sm" />
                </div>

                <div className="pt-2">
                     <div className="w-1/4 h-2 bg-gray-300 rounded-sm mb-1.5" />
                     <div className="grid grid-cols-2 gap-1">
                         <div className="h-1.5 bg-emerald-50 w-full rounded-sm" />
                         <div className="h-1.5 bg-gray-100 w-full rounded-sm" />
                         <div className="h-1.5 bg-gray-100 w-full rounded-sm" />
                         <div className="h-1.5 bg-emerald-50 w-full rounded-sm" />
                     </div>
                </div>
            </div>

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-emerald-900/40 via-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                <Badge className="bg-white/90 text-emerald-900 hover:bg-white backdrop-blur-sm shadow-lg pointer-events-none">
                    Preview Resume
                </Badge>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen text-foreground font-sans">
            <DashboardHeader />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-white/5 pb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Database className="w-5 h-5 text-emerald-500" />
                             </div>
                             Resume Library
                        </h1>
                        <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
                            Access a vast collection of real-world <span className="text-emerald-400 font-medium">JSON Resumes</span>. 
                            Analyze patterns, gain inspiration, or use them as templates for your next big opportunity.
                        </p>
                    </div>
                    
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                        <Input 
                            placeholder="Search by name..." 
                            className="pl-10 h-12 bg-white/5 border-white/10 text-white focus:border-emerald-500/50 rounded-xl transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                        </div>
                        <p className="text-muted-foreground animate-pulse">Loading library...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                            {visibleResumes.map((resume, index) => {
                                const formattedName = formatName(resume.name);
                                return (
                                    <motion.div
                                        key={resume.name || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        onClick={() => navigate(`/dashboard/resumes/${resume.name}`)}
                                        className="group cursor-pointer flex flex-col gap-3"
                                    >
                                        <div className="relative">
                                            <ResumeThumbnail name={formattedName} />
                                             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <Button 
                                                    variant="secondary" 
                                                    size="icon" 
                                                    className="h-8 w-8 rounded-full bg-white/90 text-gray-900 shadow-sm hover:bg-white"
                                                    onClick={(e) => { e.stopPropagation(); handleDownloadJson(resume); }}
                                                    title="Download JSON"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                </Button>
                                             </div>
                                        </div>
                                        
                                        <div className="px-1">
                                            <h3 className="font-medium text-white text-sm truncate group-hover:text-emerald-400 transition-colors">
                                                {formattedName}
                                            </h3>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <FileText className="w-3 h-3" /> JSON
                                                </span>
                                                <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-semibold bg-white/5 px-1.5 py-0.5 rounded">
                                                    {(resume.size / 1024).toFixed(1)} KB
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        
                        {visibleResumes.length < filteredResumes.length && (
                            <div className="flex justify-center mt-12 pb-8">
                                <Button 
                                    onClick={handleLoadMore}
                                    variant="outline"
                                    className="border-white/10 text-white hover:bg-white/5 min-w-[200px] h-12 rounded-xl gap-2 group"
                                >
                                    Load More Resumes
                                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:translate-y-0.5 transition-transform" />
                                </Button>
                            </div>
                        )}

                        {filteredResumes.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <FileText className="w-16 h-16 text-white/10 mb-4" />
                                <h3 className="text-xl font-bold text-white">No resumes found</h3>
                                <p className="text-muted-foreground mt-2 max-w-sm">
                                    We couldn't find any resumes matching "{searchQuery}". Try a different search term.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};
export default ResumesPage;
