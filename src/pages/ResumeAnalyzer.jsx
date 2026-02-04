import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    Upload, 
    Sparkles, 
    CheckCircle, 
    AlertTriangle, 
    XCircle,
    Brain,
    Target,
    Loader2,
    Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardHeader from '@/components/DashboardHeader';
import AntiGravity from '@/components/ui/AntiGravity';
import { useAuth } from '@/context/AuthContext';
import puter from '@heyputer/puter.js';
import { sampleResumes } from '@/data/sampleResumes';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const ResumeAnalyzer = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Keeping it for potential future re-integration or if needed by header (unlikely but safe)
    
    const [resumeText, setResumeText] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const fileInputRef = useRef(null);

    const loadSample = () => {
        const randomSample = sampleResumes[Math.floor(Math.random() * sampleResumes.length)];
        setResumeText(randomSample.content);
        setJobRole(randomSample.role);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);

        try {
            let text = '';
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
                const pdf = await loadingTask.promise;
                
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                }
                text = fullText.trim();
            } else {
                text = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (e) => reject(e);
                    reader.readAsText(file);
                });
            }
            setResumeText(text);
        } catch (err) {
            console.error("File processing error:", err);
            alert("Error reading file. Please try pasting the text instead.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAnalyze = async () => {
        if (!resumeText.trim()) return;

        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            // 1. Prepare Prompt
            const prompt = `
                You are an expert ATS (Applicant Tracking System) and Resume Coach. 
                Analyze the following resume text for the role of "${jobRole || 'General Role'}".
                
                Resume Text:
                "${resumeText.slice(0, 4000)}" 
                
                Return a valid JSON object with the following structure (do NOT return markdown code blocks, just raw JSON):
                {
                    "ats_score": (number 0-100),
                    "skill_match_percentage": (number 0-100),
                    "summary": "Brief professional summary of the candidate",
                    "strengths": ["array", "of", "strings"],
                    "weaknesses": ["array", "of", "strings"],
                    "missing_skills": ["array", "of", "strings"],
                    "job_fit": "High/Medium/Low",
                    "suggestions": ["Actionable improvement 1", "Actionable improvement 2"]
                }
            `;

            // 2. Call AI
            const response = await puter.ai.chat(prompt);
            
            // 3. Parse JSON (Handle potential markdown wrapping)
             let cleanJson = "";
            if (typeof response === 'string') {
                cleanJson = response;
            } else if (response?.message?.content) {
                cleanJson = response.message.content;
            } else if (Array.isArray(response) && response[0]?.message?.content) {
                 cleanJson = response[0].message.content;
            } else {
                 console.warn("Unexpected AI response format:", response);
                 cleanJson = typeof response === 'object' ? JSON.stringify(response) : String(response);
            }

            cleanJson = cleanJson.trim();
            if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '');
            if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/```/g, '').replace(/```/g, '');
            
            const result = JSON.parse(cleanJson);

            setAnalysisResult(result);

        } catch (error) {
            console.error("Analysis failed:", error);
            // Handle error UI
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen text-foreground font-sans">
            <DashboardHeader />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
                
                {/* Header Title */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
                >
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                             <Brain className="text-indigo-500" /> AI Resume Analyzer
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Optimize your resume with enterprise-grade AI analysis.
                        </p>
                    </div>
                     {analysisResult && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Button 
                                onClick={() => navigate('/dashboard/jobs', { state: { resumeText, analysisResult, jobRole } })}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            >
                                <Briefcase className="w-4 h-4 mr-2" /> Find Matching Jobs
                            </Button>
                        </motion.div>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

                    
                    {/* Left Panel: Input */}
                    <motion.div 
                        className="lg:col-span-4 space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                         <Card className="bg-[#131722]/60 backdrop-blur-xl border-white/5 h-fit">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-emerald-400" /> Upload / Input
                                </CardTitle>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={loadSample}
                                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 h-8"
                                >
                                     <Sparkles className="w-3 h-3 mr-1" /> Load Sample
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Target Job Role</label>
                                    <Input 
                                        placeholder="e.g. Senior React Developer" 
                                        className="bg-black/20 border-white/10 text-white focus:border-indigo-500/50"
                                        value={jobRole}
                                        onChange={(e) => setJobRole(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Resume Content</label>
                                    
                                    {/* File Upload Area */}
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/5 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all mb-4 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <Upload className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <p className="text-sm text-white font-medium">Click to upload file</p>
                                        <p className="text-xs text-muted-foreground mt-1">Supports TXT, MD, JSON (PDF/DOCX - Text Paste Recommended)</p>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept=".pdf,.txt,.md,.json"
                                            onChange={handleFileUpload}
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                                            <Badge variant="outline" className="bg-black/40 border-white/10 text-muted-foreground text-[10px] uppercase tracking-wider">
                                                Paste Text
                                            </Badge>
                                        </div>
                                        <Textarea 
                                            placeholder="...or paste your resume text here." 
                                            className="min-h-[200px] bg-black/20 border-white/10 text-white focus:border-indigo-500/50 resize-none font-mono text-xs leading-relaxed pt-10"
                                            value={resumeText}
                                            onChange={(e) => setResumeText(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button 
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 border-0"
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || !resumeText}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" /> Analyze Resume
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Panel: Results */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {isAnalyzing ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center min-h-[400px] bg-[#131722]/60 backdrop-blur-xl border border-white/5 rounded-2xl relative overflow-hidden"
                                >
                                    {/* Abstract Grid Background */}
                                    <div className="absolute inset-0 bg-grid-white/[0.02]" />
                                    
                                    {/* Scanning Effect */}
                                    <div className="relative z-10 w-64 h-80 bg-white/5 rounded-lg border border-white/10 overflow-hidden flex flex-col p-4 space-y-3 mb-8 shadow-2xl shadow-indigo-500/10">
                                        <div className="w-1/3 h-2 bg-white/20 rounded" />
                                        <div className="w-full h-2 bg-white/10 rounded" />
                                        <div className="w-5/6 h-2 bg-white/10 rounded" />
                                        <div className="w-4/5 h-2 bg-white/10 rounded" />
                                        <div className="w-full h-10 bg-white/5 rounded mt-4" />
                                        <div className="space-y-2 mt-4">
                                            <div className="w-full h-2 bg-white/10 rounded" />
                                            <div className="w-full h-2 bg-white/10 rounded" />
                                            <div className="w-2/3 h-2 bg-white/10 rounded" />
                                        </div>

                                        {/* Scanner Line */}
                                        <motion.div 
                                            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm"
                                            animate={{ top: ["0%", "100%", "0%"] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        />
                                        <motion.div 
                                            className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-cyan-500/20 to-transparent"
                                            animate={{ top: ["-10%", "90%", "-10%"] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        />
                                    </div>

                                    <div className="relative z-10 text-center space-y-3">
                                        <div className="flex items-center justify-center gap-2 text-cyan-400">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="font-mono text-sm tracking-widest uppercase">Processing</span>
                                        </div>
                                        
                                        <div className="h-8 overflow-hidden relative">
                                            <motion.div
                                                animate={{ y: [0, -32, -64, -96, 0] }}
                                                transition={{ duration: 8, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" }}
                                                className="flex flex-col items-center"
                                            >
                                                <span className="h-8 flex items-center text-white font-medium text-lg">Parsing Resume Content...</span>
                                                <span className="h-8 flex items-center text-white font-medium text-lg">Identifying Key Skills...</span>
                                                <span className="h-8 flex items-center text-white font-medium text-lg">Calculating ATS Score...</span>
                                                <span className="h-8 flex items-center text-white font-medium text-lg">Generating Feedback...</span>
                                                <span className="h-8 flex items-center text-white font-medium text-lg">Parsing Resume Content...</span>
                                            </motion.div>
                                        </div>
                                    </div>

                                </motion.div>
                            ) : analysisResult ? (
                                <motion.div 
                                    className="space-y-6"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    key="result"
                                >
                                    {/* Top Score Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <AntiGravity duration={8}>
                                            <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border-indigo-500/30 overflow-hidden relative">
                                                 <div className="absolute inset-0 bg-grid-white/[0.05]" />
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-indigo-200">ATS Score</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-4xl font-bold text-white flex items-baseline gap-1">
                                                        {analysisResult.ats_score}<span className="text-lg text-white/50">/100</span>
                                                    </div>
                                                    <Progress value={analysisResult.ats_score} className="h-1 mt-3 bg-white/10" indicatorClassName="bg-indigo-500" />
                                                </CardContent>
                                            </Card>
                                        </AntiGravity>

                                        <AntiGravity duration={9} delay={1}>
                                            <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/30">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-emerald-200">Skill Match</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-4xl font-bold text-white flex items-baseline gap-1">
                                                        {analysisResult.skill_match_percentage}%
                                                    </div>
                                                    <Progress value={analysisResult.skill_match_percentage} className="h-1 mt-3 bg-white/10" indicatorClassName="bg-emerald-500" />
                                                </CardContent>
                                            </Card>
                                        </AntiGravity>

                                        <AntiGravity duration={10} delay={2}>
                                             <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-blue-500/30">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-blue-200">Job Fit</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold text-white mt-2">
                                                        {analysisResult.job_fit}
                                                    </div>
                                                    <div className="text-xs text-blue-200/50 mt-1">Based on Role Analysis</div>
                                                </CardContent>
                                            </Card>
                                        </AntiGravity>
                                    </div>

                                    {/* Detailed Analysis */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="bg-[#131722]/60 backdrop-blur-xl border-white/5">
                                            <CardHeader>
                                                <CardTitle className="text-white flex items-center gap-2">
                                                    <CheckCircle className="w-5 h-5 text-emerald-400" /> Strengths
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-3">
                                                    {analysisResult.strengths?.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-[#131722]/60 backdrop-blur-xl border-white/5">
                                            <CardHeader>
                                                <CardTitle className="text-white flex items-center gap-2">
                                                    <AlertTriangle className="w-5 h-5 text-amber-400" /> Improvements
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-3">
                                                    {analysisResult.weaknesses?.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>

                                     <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
                                        <CardHeader>
                                            <CardTitle className="text-white flex items-center gap-2">
                                                <Target className="w-5 h-5 text-indigo-400" /> Strategic Suggestions
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {analysisResult.suggestions?.map((item, i) => (
                                                    <li key={i} className="bg-black/20 rounded-lg p-3 text-sm text-indigo-100 border border-indigo-500/10 flex gap-3">
                                                        <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                                                            {i + 1}
                                                        </div>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>

                                     {analysisResult.missing_skills?.length > 0 && (
                                        <Card className="bg-[#131722]/60 backdrop-blur-xl border-white/5">
                                            <CardHeader>
                                                <CardTitle className="text-white flex items-center gap-2">
                                                    <XCircle className="w-5 h-5 text-red-400" /> Missing Skills
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysisResult.missing_skills.map((skill, i) => (
                                                        <Badge key={i} variant="outline" className="border-red-500/30 text-red-300 bg-red-500/5">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                     )}

                                </motion.div>
                            ) : (
                                // Empty State
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center min-h-[400px] text-center p-8 border border-white/5 rounded-2xl bg-white/[0.02] border-dashed"
                                >
                                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                                        <FileText className="w-10 h-10 text-indigo-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Ready to Analyze?</h2>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        Paste your resume text and target job role to get a comprehensive AI analysis, ATS score, and tailored improvement suggestions.
                                    </p>
                                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <div className="font-bold text-emerald-400 text-xl font-mono">10x</div>
                                            <div className="text-xs text-muted-foreground">Faster Screening</div>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <div className="font-bold text-purple-400 text-xl font-mono">95%</div>
                                            <div className="text-xs text-muted-foreground">Accuracy</div>
                                        </div>
                                         <div className="bg-white/5 p-4 rounded-lg">
                                            <div className="font-bold text-blue-400 text-xl font-mono">24/7</div>
                                            <div className="text-xs text-muted-foreground">Availability</div>
                                        </div>
                                         <div className="bg-white/5 p-4 rounded-lg">
                                            <div className="font-bold text-amber-400 text-xl font-mono">AI</div>
                                            <div className="text-xs text-muted-foreground">Powered</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResumeAnalyzer;
