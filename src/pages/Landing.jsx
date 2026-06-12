import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="h-screen w-full overflow-hidden bg-black relative">
       {/* Full-Screen Standalone Cover (Page 1) */}
       <div className="h-full w-full relative flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
          
         </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-6 relative z-10 text-center space-y-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-8xl md:text-[11rem] font-black tracking-tighter leading-[0.8] flex flex-col gap-4">
                <span className="text-white filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">SkillNova</span>
                <span className="text-2xl md:text-5xl font-mono tracking-[0.2em] bg-gradient-to-r from-brand-primary via-emerald-400 to-green-500 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(34,197,94,0.4)] whitespace-nowrap">AI Analysis Engine</span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/40 text-xl md:text-3xl font-medium tracking-tight"
              >
                “Discover your skills. Bridge the gap. Become placement ready.”
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              <Link to="/login">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(34,197,94,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-16 py-8 bg-emerald-500 text-white font-black text-2xl uppercase tracking-[0.2em] rounded-full shadow-[0_20px_60px_rgba(34,197,94,0.5)] border-2 border-emerald-400 hover:bg-emerald-400 transition-all flex items-center justify-center gap-4 group"
                >
                  Get Started
                  <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-white/30 font-black">Analysis Mode Enabled</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-primary/60 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
