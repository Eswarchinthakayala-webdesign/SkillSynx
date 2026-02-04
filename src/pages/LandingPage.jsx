import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Upload, 
  Cpu, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Search, 
  CheckCircle2,
  Sparkles,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';



// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden selection:bg-primary/30 font-sans">
      
      {/* Background Gradients - Subtle & Clean */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <CustomSVGFlow />
        <FeatureCards />
        <AnalyticsPreview />
        <HowItWorks />
        <TrustSection />
        <CTASection />
        
        <footer className="py-12 text-center text-muted-foreground text-sm border-t border-border bg-background/50 backdrop-blur-sm">
          <p>© {new Date().getFullYear()} SkillSynx AI. Built for the future of work.</p>
        </footer>
      </div>
    </div>
  );
};

// --- Sections ---

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAnalyzeClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto flex flex-col items-center gap-12 text-center">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="w-full space-y-10"
      >
        <motion.div variants={fadeInUp} className="flex justify-center">
          <Badge variant="outline" className="px-4 py-2 rounded-full border-primary/20 bg-primary/10 text-primary-foreground text-sm font-medium backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 mr-2 inline-block text-cyan-400" />
            AI-Powered Career Intelligence
          </Badge>
        </motion.div>
        
        <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white">
          Sync Your Skills with the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Jobs That Matter.
          </span>
        </motion.h1>
        
        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
          SkillSynx uses advanced AI to analyze your resume, optimize ATS scores, and reveal exactly what recruiters are looking for—before you apply.
        </motion.p>
        
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center">
          <Button onClick={handleAnalyzeClick} size="lg" className="bg-primary hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] border-0 h-14 px-8 text-lg rounded-full font-medium transition-all duration-300 transform hover:scale-105">
            Analyze Resume <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="border-border hover:bg-white/5 text-foreground h-14 px-8 text-lg rounded-full glass">
            View Sample Report
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

const FloatingCard = ({ delay, icon, label, value, className }) => (
    <motion.div 
    animate={{ y: [-6, 6, -6] }} 
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
    className={cn("absolute p-4 glass rounded-2xl flex items-center gap-4 z-20", className)}
 >
    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
      {icon}
    </div>
    <div>
       <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</div>
       <div className="text-xl font-bold text-white tracking-tight">{value}</div>
    </div>
 </motion.div>
)

const CustomSVGFlow = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-20 text-center relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Badge variant="outline" className="mb-5 bg-indigo-500/10 text-indigo-300 border-indigo-500/20 backdrop-blur-md px-4 py-1.5 text-sm">
                The Engine
            </Badge>
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight relative z-10">
            From Raw Data to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Strategic Insights</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg relative z-10">
            SkillSynx deconstructs your professional DNA and rebuilds it for the modern hiring algorithm in four powerful steps.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent z-0">
                <div className="absolute inset-0 bg-indigo-500/50 blur-[2px]" />
            </div>

            <ProcessCard 
                step="01"
                icon={<FileText className="w-6 h-6" />}
                title="Ingestion"
                desc="Secure parsing of PDF/DOCX structure & metadata layers."
                delay={0}
            />
            <ProcessCard 
                step="02"
                icon={<Cpu className="w-6 h-6" />}
                title="Neural Analysis"
                desc="LLM extraction of skills, experience, and hidden context."
                active={true}
                delay={0.2}
            />
            <ProcessCard 
                step="03"
                icon={<Target className="w-6 h-6" />}
                title="Semantic Match"
                desc="Vector-based alignment with millions of job descriptions."
                delay={0.4}
            />
            <ProcessCard 
                step="04"
                icon={<BarChart3 className="w-6 h-6" />}
                title="Scoring & Strategy"
                desc="ACTIONABLE confidence scores and fix roadmap generation."
                delay={0.6}
            />
        </div>
      </div>
    </section>
  );
};

const ProcessCard = ({ step, icon, title, desc, active, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className="relative group"
    >
        <div className={cn(
            "h-full p-8 rounded-2xl border backdrop-blur-xl transition-all duration-500 flex flex-col items-start relative overflow-hidden z-10",
            active 
                ? "bg-indigo-950/10 border-indigo-500/30 shadow-[0_0_40px_-10px_rgba(79,70,229,0.2)]" 
                : "bg-background/20 border-white/5 hover:border-indigo-500/20 hover:bg-background/40"
        )}>
             {/* Gradient Glow Effect on Hover */}
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none" />

            {/* Step Number */}
            <div className="text-5xl font-bold text-white/[0.03] absolute top-4 right-6 font-sans select-none group-hover:text-white/[0.06] transition-colors">
                {step}
            </div>

            <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center text-foreground mb-6 transition-all duration-300",
                active 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-600/20" 
                    : "bg-white/5 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:scale-110"
            )}>
                {icon}
            </div>
            
            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-indigo-200 transition-colors">
                {title}
            </h3>
            
            <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-slate-300 transition-colors">
                {desc}
            </p>

             {/* Connection Node (Desktop) */}
            <div className="hidden md:block absolute top-[60px] -right-[15px] w-[6px] h-[6px] rounded-full bg-indigo-500/30 z-20 group-hover:bg-indigo-400 transition-colors">
                <div className="absolute inset-0 animate-ping bg-indigo-500 rounded-full opacity-50" />
            </div>
        </div>
    </motion.div>
);

const FeatureCards = () => {
    const features = [
        { 
            title: "ATS Score Intelligence", 
            desc: "Get a quantitative score of how well you pass screening robots using industry-standard algorithms.", 
            icon: <Zap /> 
        },
        { 
            title: "Skill Gap Detection", 
            desc: "Instantly identify missing keywords and hard skills required for your specific target role.", 
            icon: <Search /> 
        },
        { 
            title: "Resume vs JD Matching", 
            desc: "Compare your profile directly against specific job descriptions with semantic vector logic.", 
            icon: <Target /> 
        },
        { 
            title: "AI Rewrite Suggestions", 
            desc: "One-click enhancements to phrasing, impact verbs, and structure powered by GPT-4o.", 
            icon: <Sparkles /> 
        },
    ];

    return (
        <section id="features" className="py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                 <div className="text-center mb-20 max-w-3xl mx-auto">
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                            Engineered for <span className="text-indigo-400">Excellence</span>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Equip yourself with the same powerful AI technology used by Fortune 500 hiring teams to filter candidates.
                        </p>
                    </motion.div>
                </div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, i) => (
                        <motion.div 
                            key={i} 
                            variants={fadeInUp} 
                            className="h-full"
                        >
                            <div className="h-full p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-primary/50 hover:to-primary/10 transition-colors duration-500 group">
                                <div className="h-full bg-[#0B0F1A]/90 backdrop-blur-xl rounded-xl p-6 relative overflow-hidden">
                                    
                                    {/* Inner Glow */}
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center mb-6 text-muted-foreground group-hover:text-primary group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 relative z-10">
                                        {feature.icon}
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors relative z-10">{feature.title}</h3>
                                    
                                    <p className="text-muted-foreground text-sm leading-relaxed relative z-10 group-hover:text-slate-300 transition-colors">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const AnalyticsPreview = () => {
    return (
        <section id="analytics" className="py-24 bg-white/[0.02] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-20">
                <div className="flex-1 space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Visualize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Career Potential</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Our dashboard provides deep analytics into your professional profile, highlighting strengths and opportunities instantly.
                    </p>
                    
                    <ul className="space-y-5 pt-4">
                        {[
                            "Real-time ATS parsing simulation",
                            "Keyword density analysis",
                            "Formatting & structural checks",
                            "Industry benchmark comparisons"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-1 w-full relative">
                    {/* Mock Dashboard Card */}
                    <div className="bg-[#0f1420] border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                        
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h4 className="font-semibold text-foreground text-lg">Analysis Result</h4>
                                <p className="text-xs text-muted-foreground mt-1">Last updated just now</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">Passed</div>
                        </div>

                        <div className="grid grid-cols-2 gap-5 mb-8">
                           <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-4xl font-bold text-white mb-2">92%</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Match Rate</div>
                                <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "92%" }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="h-full bg-emerald-500" 
                                    />
                                </div>
                           </div>
                           <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-4xl font-bold text-white mb-2">A+</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Format Score</div>
                           </div>
                        </div>

                         <div className="space-y-4">
                            <div className="flex justify-between text-sm py-2 border-b border-white/5">
                                <span className="text-muted-foreground">Keywords Found</span>
                                <span className="text-foreground font-mono">18/20</span>
                            </div>
                             <div className="flex justify-between text-sm py-2 border-b border-white/5">
                                <span className="text-muted-foreground">Experience Impact</span>
                                <span className="text-emerald-400 font-medium">High</span>
                            </div>
                            <div className="flex justify-between text-sm py-2">
                                <span className="text-muted-foreground">Education Verified</span>
                                <span className="text-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Yes</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-32 px-6 md:px-12 text-center">
             <div className="max-w-3xl mx-auto mb-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, Powerful Workflow</h2>
                <p className="text-muted-foreground text-lg">Three steps to your dream job.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                 {[
                    { step: "01", title: "Upload Resume", desc: "Securely upload your PDF or DOCX file." },
                    { step: "02", title: "AI Analysis", desc: "Our engine scans for 50+ ATS parameters." },
                    { step: "03", title: "Get Insights", desc: "Receive actionable fixes and optimizations." }
                 ].map((item, i) => (
                    <div key={i} className="relative p-8 rounded-2xl border border-dashed border-border hover:border-primary/50 hover:bg-white/[0.02] transition-colors group text-left">
                        <div className="text-5xl font-bold text-white/5 absolute top-6 right-6 group-hover:text-primary/10 transition-colors">{item.step}</div>
                        <div className="relative z-10 pt-4">
                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                 ))}
            </div>
        </section>
    );
};

const TrustSection = () => {
    return (
        <section className="py-16 border-t border-border/50">
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex items-center gap-3 text-lg font-bold text-foreground">
                  <ShieldCheck className="w-6 h-6 text-primary" /> Privacy First
               </div>
                <div className="flex items-center gap-3 text-lg font-bold text-foreground">
                  <Cpu className="w-6 h-6 text-primary" /> GPT-4o Powered
               </div>
                <div className="flex items-center gap-3 text-lg font-bold text-foreground">
                  <FileText className="w-6 h-6 text-primary" /> ISO Compliant
               </div>
            </div>
        </section>
    );
};

const CTASection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAnalyzeClick = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/signup');
        }
    };

    return (
        <section className="py-32 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-white">
                    Ready to Land Your <span className="text-primary">Next Role?</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
                    Join thousands of job seekers optimizing their careers with AI precision. No credit card required to start.
                </p>
                
                <div className="group relative inline-block">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-primary to-purple-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
                    <Button onClick={handleAnalyzeClick} size="lg" className="relative h-16 px-12 text-xl rounded-full bg-background text-white border border-white/10 hover:bg-white/5 transition-all cursor-pointer">
                        Analyze Your Resume Now
                    </Button>
                </div>
                
                <p className="mt-8 text-sm text-muted-foreground">
                    No sign-up required for initial scan. Instant AI insights.
                </p>
            </div>
        </section>
    );
};

export default LandingPage;