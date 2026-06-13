import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload, User, Mail, Briefcase, GraduationCap, 
  MapPin, Brain, ShieldCheck, Target, Sparkles, 
  Cpu, Activity, Layers, Activity as PulseIcon,
  ChevronRight, ArrowRight, Zap, Database
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setIsScanning(true);
      setTimeout(() => navigate("/analysis"), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-black selection:bg-brand-primary/30">
        {/* Cinematic Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.08),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.08),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
            {/* Neural Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-20 space-y-4"
            >
                <div className="flex items-center justify-center gap-3 text-brand-primary mb-4">
                  <Cpu className="w-5 h-5 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.8em]">Identity Synchronization v2.0</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                  AI PROFILE <br />
                  <span className="neon-text">CALIBRATION</span>
                </h1>
                <p className="text-white/40 font-mono text-sm tracking-widest uppercase">
                  Deconstructing Professional DNA... [0% Complete]
                </p>
                
                {/* Visual Progress Line */}
                <div className="w-64 h-1 bg-white/5 mx-auto rounded-full overflow-hidden mt-8 relative">
                    <motion.div 
                      initial={{ left: "-100%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"
                    />
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!isScanning ? (
                <motion.div
                  key="form"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20, filter: "blur(20px)" }}
                  className="max-w-4xl mx-auto space-y-12"
                >
                  {/* Step 1: Core Parameters */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <motion.div variants={cardVariants}>
                          <GlassCard className="p-10 group relative overflow-hidden" glow>
                             <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
                                   <User className="w-6 h-6 text-brand-primary" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Academic Identity</h3>
                             </div>
                             
                             <div className="space-y-6">
                                <div className="relative group/input">
                                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 block">Standard Vector</label>
                                   <input 
                                     type="text" 
                                     placeholder="B.Tech Computer Science" 
                                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all outline-none"
                                   />
                                </div>
                                <div className="relative group/input">
                                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 block">Institution ID</label>
                                   <input 
                                     type="text" 
                                     placeholder="Enter University" 
                                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-primary/50 transition-all outline-none"
                                   />
                                </div>
                             </div>
                          </GlassCard>
                       </motion.div>

                       <motion.div variants={cardVariants}>
                          <GlassCard className="p-10" glow>
                             <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                   <Briefcase className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Career Vector</h3>
                             </div>
                             
                             <div className="space-y-6">
                                <div className="relative group/input">
                                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 block">Target Domain</label>
                                   <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 transition-all outline-none appearance-none text-white">
                                      <option className="bg-zinc-900 text-white">Software Engineering</option>
                                      <option className="bg-zinc-900 text-white">AI / Machine Learning</option>
                                      <option className="bg-zinc-900 text-white">Data Analytics</option>
                                      <option className="bg-zinc-900 text-white">Cybersecurity</option>
                                   </select>
                                </div>
                                <div className="relative group/input">
                                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 block">Experience Level</label>
                                   <div className="flex gap-4">
                                      {["Entry", "Mid", "Senior"].map((level) => (
                                        <button 
                                          key={level}
                                          className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-bold uppercase transition-all hover:border-brand-primary"
                                        >
                                          {level}
                                        </button>
                                      ))}
                                   </div>
                                </div>
                             </div>
                          </GlassCard>
                       </motion.div>
                    </div>
                  )}

                  {/* Step 2: Resource Uplink (Resume) */}
                  {step === 2 && (
                    <motion.div variants={cardVariants} className="max-w-2xl mx-auto">
                        <GlassCard className="p-16 text-center space-y-8 relative overflow-hidden" glow>
                            {/* Scanning Laser Line */}
                            <motion.div 
                               animate={{ top: ["-10%", "110%"] }}
                               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                               className="absolute inset-x-0 h-1 bg-brand-primary/20 blur-[2px] z-20 pointer-events-none"
                            ></motion.div>

                            <div className="w-24 h-24 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-brand-primary/30 group hover:bg-brand-primary/20 transition-all">
                                <Upload className="w-10 h-10 text-brand-primary group-hover:scale-110 transition-transform" />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black uppercase tracking-tighter">Initialize AI Capture</h3>
                                <p className="text-white/30 text-sm">Upload your career blueprint (.PDF / .DOCX)</p>
                            </div>

                            <div className="border-2 border-dashed border-white/5 rounded-[2rem] p-12 hover:border-brand-primary/30 transition-all group cursor-pointer">
                                <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/20 group-hover:text-white/40">Drop Files to Sync</span>
                            </div>

                            <div className="flex justify-center gap-6">
                               <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase font-black">
                                  <ShieldCheck className="w-3 h-3 text-brand-primary" />
                                  Encrypted
                               </div>
                               <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase font-black">
                                  <Brain className="w-3 h-3 text-purple-400" />
                                  AI Parsed
                               </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                  )}

                  {/* Footer Navigation */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-10">
                    <div className="flex gap-2">
                       {[1, 2].map((i) => (
                         <div 
                           key={i} 
                           className={`h-1 transition-all duration-500 rounded-full ${i === step ? 'w-12 bg-brand-primary' : 'w-4 bg-white/10'}`}
                         />
                       ))}
                    </div>

                    <button 
                      onClick={handleNext}
                      className="px-12 py-5 bg-brand-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 relative overflow-hidden group shadow-[0_20px_40px_rgba(34,197,94,0.3)]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {step === 2 ? "START CALIBRATION" : "NEXT SEQUENCE"} 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="relative w-64 h-64 mb-12">
                         {/* Spinning Rings */}
                         <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-0 border-2 border-dashed border-brand-primary/40 rounded-full"
                         />
                         <motion.div 
                           animate={{ rotate: -360 }}
                           transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-4 border border-emerald-500/30 rounded-full"
                         />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-32 h-32 bg-brand-primary/20 blur-3xl rounded-full"
                            />
                            <Brain className="w-16 h-16 text-brand-primary relative z-10" />
                         </div>
                    </div>
                    
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 animate-pulse">Initializing AI Interface</h2>
                    <p className="text-white/30 font-mono text-xs uppercase tracking-[0.5em]">Synchronizing Professional Clusters...</p>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
    </div>
  );
};

export default ProfileSetup;
