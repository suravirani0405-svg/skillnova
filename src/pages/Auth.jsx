import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import { Mail, Lock, UserPlus, LogIn, ArrowRight, GraduationCap, Calendar, Target, User, ShieldAlert, Loader2, Eye, EyeOff, ShieldCheck, BookOpen } from "lucide-react";
import { authService } from "../services/authService";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState("EMAIL"); // EMAIL, CODE, NEW_PASS, SUCCESS
  
  // Recovery data state
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryNewPass, setRecoveryNewPass] = useState("");

  // Visibility States
  const [showPassword, setShowPassword] = useState(false);

  // Auto-redirect removed to allow viewing login screens during identity sync testing
  /*
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('skillnova_user') || 'null');
    if (user && !isForgotPassword) {
      navigate('/dashboard');
    }
  }, [navigate, isForgotPassword]);
  */

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const collegeRef = useRef();
  const yearRef = useRef();
  const domainRef = useRef();
  const degreeRef = useRef();

  const handleForgotPasswordSequence = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (recoveryStep === "EMAIL") {
        await authService.sendVerification(recoveryEmail);
        setRecoveryStep("CODE");
      } else if (recoveryStep === "CODE") {
        await authService.verifyCode(recoveryEmail, recoveryCode);
        setRecoveryStep("NEW_PASS");
      } else if (recoveryStep === "NEW_PASS") {
        if (recoveryNewPass.length < 8) {
          throw new Error("Pattern too weak: Minimum of 8 components required.");
        }
        await authService.resetPassword(recoveryEmail, recoveryCode, recoveryNewPass);
        setRecoveryStep("SUCCESS");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isForgotPassword) {
      return handleForgotPasswordSequence(e);
    }

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(emailRef.current.value, passwordRef.current.value);
      } else {
        await authService.register({
          name: nameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
          college: collegeRef.current.value,
          degree: degreeRef.current.value,
          year: yearRef.current.value,
          domain: domainRef.current.value
        });
      }
      
      navigate('/welcome');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetRecovery = () => {
    setIsForgotPassword(false);
    setRecoveryStep("EMAIL");
    setRecoveryEmail("");
    setRecoveryCode("");
    setRecoveryNewPass("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background glow and stars */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <GlassCard className="p-12 border-emerald-500/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
            <div className="text-center mb-10 relative z-10">
              <motion.h2 
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(34,197,94,0.5)", 
                    "0 0 20px rgba(34,197,94,0.8)", 
                    "0 0 10px rgba(34,197,94,0.5)"
                  ],
                  opacity: [1, 0.9, 1, 0.8, 1]
                }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                className="text-6xl font-black uppercase tracking-tighter text-white underline underline-offset-8 decoration-emerald-500/30"
              >
                {isForgotPassword ? "RECOVERY" : (isLogin ? "WELCOME" : "WELCOME")}
              </motion.h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-1 italic">
                {isForgotPassword ? (
                   recoveryStep === "EMAIL" ? "Scanning for lost AI access patterns" :
                   recoveryStep === "CODE" ? "Awaiting identity Masterkey confirmation" :
                   recoveryStep === "NEW_PASS" ? "Identity authorized for pattern rewrite" :
                   "AI recovery protocol successful"
                ) : (isLogin ? "Re-enter the SkillNova network" : "Create your digital professional twin")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <AnimatePresence mode="wait">
                {isForgotPassword ? (
                   <motion.div
                     key="recovery"
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     exit={{ opacity: 0, height: 0 }}
                     className="space-y-6"
                   >
                     {recoveryStep === "SUCCESS" ? (
                       <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-6">
                         <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-brand-primary/40 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                            <ShieldCheck className="w-8 h-8 text-brand-primary" />
                         </div>
                         <div className="space-y-2">
                           <h4 className="text-xl font-black text-white uppercase tracking-widest">Acess Restored</h4>
                           <p className="text-brand-primary/60 text-[9px] font-black uppercase tracking-widest leading-relaxed">Your AI pattern has been securely rewritten. Identity nodes are now synchronized.</p>
                         </div>
                         <button 
                            type="button"
                            onClick={resetRecovery}
                            className="w-full py-4 bg-brand-primary text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                         >
                            Uplink Now
                         </button>
                       </div>
                     ) : (
                       <>
                         <div className="space-y-2 text-center pb-4">
                            <div className="flex justify-center gap-1">
                               {[ "EMAIL", "CODE", "NEW_PASS" ].map((s, i) => (
                                  <div key={i} className={`w-12 h-1 rounded-full ${recoveryStep === s ? "bg-brand-primary" : "bg-white/5"}`} />
                               ))}
                            </div>
                         </div>

                         {recoveryStep === "EMAIL" && (
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60 italic ml-1 italic">Enter Communication Uplink (Email)</label>
                              <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                  type="email"
                                  required
                                  value={recoveryEmail}
                                  onChange={(e) => setRecoveryEmail(e.target.value)}
                                  placeholder="name@nexus.com"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-12 pr-5 focus:outline-none focus:border-brand-primary transition-all text-white placeholder:text-white/10"
                                />
                              </div>
                            </div>
                         )}

                         {recoveryStep === "CODE" && (
                            <div className="space-y-4">
                              <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 flex items-center gap-4">
                                <ShieldCheck className="w-6 h-6 text-brand-primary" />
                                <p className="text-[9px] text-brand-primary font-black uppercase tracking-widest leading-relaxed italic">Uplink link established. Enter demo masterkey: 123456</p>
                              </div>
                              <div className="relative group">
                                <input
                                  type="text"
                                  required
                                  maxLength="6"
                                  value={recoveryCode}
                                  onChange={(e) => setRecoveryCode(e.target.value)}
                                  placeholder="0 0 0 0 0 0"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl py-6 text-center text-4xl font-black uppercase tracking-[0.6em] focus:outline-none focus:border-brand-primary transition-all text-white placeholder:text-white/10"
                                />
                              </div>
                            </div>
                         )}

                         {recoveryStep === "NEW_PASS" && (
                            <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60 italic ml-1 italic">Define New Secure Pattern (Min 8 Components)</label>
                              <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                  type={showPassword ? "text" : "password"}
                                  required
                                  value={recoveryNewPass}
                                  onChange={(e) => setRecoveryNewPass(e.target.value)}
                                  placeholder="••••••••"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-12 pr-12 focus:outline-none focus:border-brand-primary transition-all text-white placeholder:text-white/20"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                >
                                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>
                         )}

                         <button 
                           type="submit"
                           disabled={loading}
                           className="w-full py-5 bg-emerald-500 text-white font-black uppercase tracking-[0.4em] rounded-xl hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(16,185,129,0.4)] border border-emerald-400"
                         >
                           {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                              <>
                                {recoveryStep === "EMAIL" ? "Initialize Scan" : recoveryStep === "CODE" ? "Verify Key" : "Reset Pattern"}
                                <ArrowRight className="w-5 h-5" />
                              </>
                           )}
                         </button>
                         
                         <button 
                            type="button"
                            onClick={resetRecovery}
                            className="w-full text-center text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors"
                         >
                            Return to Login Node
                         </button>
                       </>
                     )}
                   </motion.div>
                ) : (
                  <>
                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          key="register-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60">Full Name</label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                              <input
                                ref={nameRef}
                                type="text"
                                required
                                placeholder="e.g Name"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 focus:outline-none focus:border-brand-primary transition-all text-white placeholder:text-white/30"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60">College / University</label>
                             <div className="relative group">
                               <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                               <input
                                 ref={collegeRef}
                                 type="text"
                                 required
                                 placeholder="e.g College"
                                 className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 focus:outline-none focus:border-brand-primary transition-all text-white placeholder:text-white/30"
                               />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60">Degree Program</label>
                             <div className="relative group">
                               <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                               <input
                                 ref={degreeRef}
                                 type="text"
                                 required
                                 placeholder="e.g. B.Tech, M.Sc, etc."
                                 className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 focus:outline-none focus:border-brand-primary transition-all text-white placeholder:text-white/30"
                               />
                             </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60">Current Year</label>
                              <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                                <select 
                                  ref={yearRef}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 focus:outline-none focus:border-brand-primary transition-all text-white appearance-none"
                                >
                                  <option value="1" className="bg-zinc-900 text-white">1st Year</option>
                                  <option value="2" className="bg-zinc-900 text-white">2nd Year</option>
                                  <option value="3" className="bg-zinc-900 text-white">3rd Year</option>
                                  <option value="4" className="bg-zinc-900 text-white">4th Year</option>
                                </select>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60">Interested Domain</label>
                              <div className="relative group">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                  ref={domainRef}
                                  type="text"
                                  required
                                  placeholder="e.g. AI, SDE, UI/UX"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 focus:outline-none focus:border-brand-primary transition-all text-white placeholder:text-white/30"
                                />
                              </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60">Communication Uplink / Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                        <input
                          ref={emailRef}
                          type="email"
                          required
                          placeholder="name@nexus.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 focus:outline-none focus:border-brand-primary transition-all text-white placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60">Secure Access Pattern / Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                        <input
                          ref={passwordRef}
                          type={showPassword ? "text" : "password"}
                          required={!isForgotPassword}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-brand-primary transition-all text-white placeholder:text-white/20"
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                         >
                           {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                         </button>
                      </div>
                      {isLogin && (
                        <div className="flex justify-end px-1">
                          <button
                             type="button"
                             onClick={() => { setIsForgotPassword(true); setError(""); }}
                             className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-brand-primary transition-colors hover:underline"
                          >
                             Lost Access Pattern?
                          </button>
                        </div>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-emerald-500 text-white font-black uppercase tracking-[0.4em] py-5 rounded-xl shadow-[0_10px_40px_rgba(34,197,94,0.4)] hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group relative overflow-hidden border border-emerald-400"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          {isLogin ? "Log In" : "Initialize Scan"}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
                  >
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isForgotPassword && (
                 <div className="mt-10 pt-8 border-t border-white/5 text-center relative z-10">
                   <button
                     type="button"
                     onClick={() => { setIsLogin(!isLogin); setError(""); }}
                     className="text-white/30 hover:text-brand-primary transition-colors text-[10px] font-black uppercase tracking-widest"
                   >
                     {isLogin ? "create a new account" : "Already Authenticated? Sign In"}
                   </button>
                 </div>
              )}
            </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Auth;
