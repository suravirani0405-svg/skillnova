import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Sparkles, Brain, Zap, RotateCcw, Bot, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "../../utils/cn";

const QUICK_PROMPTS = [
  { label: "My Skill Gaps", prompt: "What are my current skill gaps?" },
  { label: "Roadmap Help", prompt: "Explain my AI Sync Roadmap phases." },
  { label: "Interview Tips", prompt: "Give me interview preparation tips." },
  { label: "My Score", prompt: "What is my placement readiness score?" },
];

const CHAT_FALLBACK = {
  greet: [
    "AI Uplink established. I am **Nova**, your career intelligence AI. Ready to optimize your career trajectory.",
    "Nova online. How can I assist you with your professional synchronization today?"
  ],
  skill: [
    "Based on your profile, your active skill matrix is solid. Focus on deepening those while bridging identified gaps systematically.",
    "Skill mastery is about depth over breadth. Focus on building real-world projects that showcase your primary skills."
  ],
  gap: [
    "Your detected skill gaps represent your highest-ROI learning opportunities. I recommend tackling them systematically.",
    "Gaps are just bridges to be built. Prioritize the missing skills displayed in your dashboard gap report."
  ],
  roadmap: [
    "Your **AI Sync Roadmap** is personalized to help you bridge your exact skill gaps. Complete each node by passing the Combat Test with 50%+.",
    "The progression loop is simple: Study the concept → pass the **Combat Test** → unlock the next phase. Keep pushing!"
  ],
  interview: [
    "For technical interviews: Always explain your design and algorithmic approach before writing code. Communication is key.",
    "Use our **Practice Battle** arena to simulate timed interview conditions. Focus on writing clean code and explanation."
  ],
  resume: [
    "Make sure your resume quantifies impact. Use the STAR method: *'Accomplished X, measured by Y, by doing Z.'*",
    "Keep your resume focused and under 1 page. Lead with your highest-readiness projects and verified skills."
  ],
  career: [
    "The tech industry highly values specialization. Focus on mastering your target domain rather than trying to learn everything.",
    "Build a signature portfolio project in your target career domain. Direct evidence beats bullet points every time."
  ],
  default: [
    "That is an interesting query. Tell me more about your learning goals or what project you are trying to build.",
    "I am cross-referencing your profile against current industry benchmarks. What specific role are you targeting?"
  ]
};

const smartFallbackChat = (message, context) => {
  const m = message.toLowerCase();
  const active = context.active_skills || [];
  const missing = context.missing_skills || [];
  const career = context.career_interest || "";
  const score = context.experience_score || 0;
  const name = context.name || "Commander";

  const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (/\b(hi|hello|hey|greetings|yo)\b/.test(m)) {
    let base = `Hello **${name}**! ` + randomChoice(CHAT_FALLBACK.greet);
    if (active.length > 0) {
      base += ` I see you already have strengths in **${active.slice(0, 3).join(", ")}**!`;
    }
    return base;
  }

  if (/\b(skill|strength|good at|active|expert|know)\b/.test(m)) {
    let base = randomChoice(CHAT_FALLBACK.skill);
    if (active.length > 0) {
      base += `\n\nYour verified active skills: ${active.map(s => `\n- **${s}**`).join("")}`;
    } else {
      base += "\n\nYou haven't scanned your resume yet. Head to the dashboard to initiate a deep scan and verify your skills!";
    }
    return base;
  }

  if (/\b(gap|missing|weak|lack|improve|learn|need to)\b/.test(m)) {
    let base = randomChoice(CHAT_FALLBACK.gap);
    if (missing.length > 0) {
      base += `\n\nHere are the top skill gaps you should bridge: ${missing.slice(0, 5).map(s => `\n- **${s}**`).join("")}`;
    } else {
      base += "\n\nFantastic! No major skill gaps detected. You are ready to start technical combat trials!";
    }
    return base;
  }

  if (/\b(roadmap|path|phase|node|unlock|progress)\b/.test(m)) {
    let base = randomChoice(CHAT_FALLBACK.roadmap);
    if (career) {
      base += `\n\nYour roadmap is fine-tuned for: **${career}**.`;
    }
    return base;
  }

  if (/\b(interview|round|prepare|technical|job|placement|company|recruit)\b/.test(m)) {
    let base = randomChoice(CHAT_FALLBACK.interview);
    if (missing.length > 0) {
      base += `\n\n**Quick Tip**: Be ready to discuss how you plan to learn or bridge **${missing[0]}** during your preparation.`;
    }
    return base;
  }

  if (/\b(resume|cv|profile|portfolio)\b/.test(m)) {
    return randomChoice(CHAT_FALLBACK.resume);
  }

  if (/\b(career|role|future|domain|field|interest)\b/.test(m)) {
    let base = randomChoice(CHAT_FALLBACK.career);
    if (career) {
      base += `\n\nGiven your target of **${career}**, I recommend designing a full-stack system incorporating your active skills.`;
    }
    return base;
  }

  if (/\b(score|percent|readiness|placement score|points)\b/.test(m)) {
    if (score > 0) {
      const tier = score >= 90 ? "S-Tier" : score >= 75 ? "A-Tier" : score >= 55 ? "B-Tier" : "C-Tier";
      return `Your Placement Readiness Score is **${score}%** (${tier}).\n\n` + 
        (score >= 75 
          ? "Excellent readiness! You are well-positioned for top-tier technical placement. Keep honing your system design skills." 
          : "Good start. Focus on bridging your high-priority skill gaps to push this score above 75% for optimum placement alignment.");
    } else {
      return "Your Placement Readiness Score is currently not calibrated. Please scan your resume on the dashboard to calculate your initial score.";
    }
  }

  let reply = `I've registered your message, **${name}**. `;
  if (career) {
    reply += `As a budding **${career}**, `;
  }
  if (active.length > 0) {
    reply += `leveraging your expertise in **${active[0]}** is key. `;
  }
  if (missing.length > 0) {
    reply += `To take this further, let's look at bridging your gap in **${missing[0]}**. `;
  }
  reply += "\n\nFeel free to ask me about your roadmap, skill gaps, or interview tips!";
  return reply;
};

const AIChatbot = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([{ 
    role: "bot", 
    content: "AI Uplink established. I am **Nova**, your career intelligence AI. I have access to your full profile — ask me anything about your skills, gaps, or roadmap.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread]     = useState(0);
  const scrollRef               = useRef(null);

  const getUserContext = () => {
    const analysis = JSON.parse(localStorage.getItem('skillnova_analysis') || '{}');
    const profile  = JSON.parse(localStorage.getItem('skillnova_profile') || '{}');
    const user     = JSON.parse(localStorage.getItem('skillnova_user') || '{}');
    return {
      name:             user.name || profile.name || "Commander",
      active_skills:    analysis.active_skills    || [],
      missing_skills:   analysis.missing_skills   || [],
      experience_score: analysis.experience_score || 0,
      career_interest:  user.domain || profile.careerInterest || "AI Software Engineer",
    };
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen && messages[messages.length - 1]?.role === "bot" && messages.length > 1) {
      setUnread(u => u + 1);
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) setUnread(0);
  }, [isOpen]);

  const renderContent = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} className="text-brand-primary font-black">{part.slice(2, -2)}</strong>
        : part
    );
  };

  const sendMessage = async (msgText) => {
    if (!msgText.trim() || isTyping) return;
    const userMsg = { 
      role: "user", content: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msgText,
          history: messages.slice(-6),
          context: getUserContext()
        })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: "bot", content: data.reply || "Signal lost. Try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      await new Promise(resolve => setTimeout(resolve, 800));
      const replyText = smartFallbackChat(msgText, getUserContext());
      setMessages(prev => [...prev, { 
        role: "bot", content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => setMessages([{
    role: "bot", content: "Chat cleared. Neural uplink refreshed. How can I assist you?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[90]"
              onClick={() => setIsOpen(false)}
            />

            {/* Split Screen Modal */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed inset-0 m-auto z-[100] w-[95%] max-w-[1100px] h-[85vh] max-h-[750px] bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col lg:flex-row font-sans"
            >
              {/* Left Panel - Avatar Profile */}
              <div className="lg:w-[35%] bg-gradient-to-b from-brand-primary/10 via-slate-900 to-slate-950 border-r border-slate-800 flex flex-col items-center justify-center p-8 relative shrink-0">
                
                {/* 3D-like Floating Avatar */}
                <motion.div 
                  animate={{ y: [-8, 8, -8] }} 
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-brand-primary/30 blur-3xl rounded-full scale-[1.3] group-hover:bg-brand-primary/40 transition-colors duration-700" />
                  <div className="w-56 h-56 bg-slate-800/80 rounded-[2.5rem] shadow-[0_20px_40px_rgba(16,185,129,0.15)] border-2 border-brand-primary/20 flex flex-col items-center justify-center relative z-10 overflow-hidden">
                    <div className="w-full absolute top-0 h-1/2 bg-gradient-to-b from-brand-primary/10 to-transparent" />
                    <img src="/neural_twin_base.png" alt="Nova Twin" className="w-40 h-40 object-contain drop-shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-2" />
                    <div className="flex items-center gap-2 opacity-60">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Online</span>
                    </div>
                  </div>
                </motion.div>

                {/* Identity Text */}
                <div className="mt-10 text-center space-y-3 relative z-10 w-full px-6">
                  <h2 className="text-3xl font-black text-white flex items-center justify-center gap-2 tracking-tight">
                    NOVA <Sparkles className="w-6 h-6 text-brand-primary" fill="currentColor" />
                  </h2>
                  <p className="text-[15px] text-slate-400 font-medium leading-relaxed">
                    Your Personal Career & Skills Intelligence Engine
                  </p>
                </div>

                {/* Reset Button */}
                <button onClick={clearChat} title="Clear chat"
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-slate-800/50 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-700/50 backdrop-blur-md">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Session
                </button>

                {/* Close mobile */}
                <button onClick={() => setIsOpen(false)} className="lg:hidden absolute top-6 right-6 p-2 bg-slate-800 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Right Panel - Chat Area */}
              <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden relative">
                
                <div className="hidden lg:flex justify-between items-center px-8 py-5 border-b border-slate-800 absolute top-0 w-full z-10 bg-slate-900/80 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-brand-primary" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">SkillNova Intelligence Uplink</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Messages Feed */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-10 pt-28 pb-6 space-y-2 scroll-smooth">
                  {messages.map((msg, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 25 }}
                      className={cn("flex gap-4 items-end w-full mb-8", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                    >
                      {/* Avatars */}
                      {msg.role === "bot" ? (
                        <div className="w-11 h-11 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 mb-1">
                          <Bot className="w-5 h-5 text-brand-primary" />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mb-1">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                      )}

                      {/* Bubble & Footer */}
                      <div className={cn("max-w-[80%] flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                        <div className={cn(
                          "px-6 py-4 text-[15px] leading-relaxed",
                          msg.role === "user"
                            ? "bg-slate-800 border border-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-white rounded-[1.5rem] rounded-br-sm"
                            : "bg-brand-primary/10 border border-brand-primary/20 text-white rounded-[1.5rem] rounded-bl-sm shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        )}>
                          <div className={cn(msg.role === "bot" ? "opacity-90" : "opacity-100 font-medium")}>
                             {msg.role === "bot" ? renderContent(msg.content) : msg.content}
                          </div>
                        </div>
                        
                        {/* Footer stats & feedback */}
                        <div className={cn("flex items-center gap-4 mt-2 px-2", msg.role === "user" && "flex-row-reverse")}>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {msg.timestamp}
                          </span>
                          {msg.role === "bot" && (
                            <div className="flex gap-1.5 border border-slate-700/50 rounded-lg p-0.5 bg-slate-800/50">
                              <button className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-[6px] transition-all">
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-[6px] transition-all">
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-end mb-8">
                      <div className="w-11 h-11 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 mb-1">
                        <Bot className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div className="px-6 py-5 bg-brand-primary/10 border border-brand-primary/20 rounded-[1.5rem] rounded-bl-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:0.3s]" />
                        <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-brand-primary/70">Nova is processing...</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="px-6 md:px-10 pb-8 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-4 z-10">
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                    {QUICK_PROMPTS.map((q, i) => (
                      <button key={i} onClick={() => sendMessage(q.prompt)}
                        className="whitespace-nowrap px-4 py-2 text-[12px] font-bold border border-slate-700 text-slate-400 bg-slate-800/50 rounded-full hover:bg-brand-primary/10 hover:border-brand-primary hover:text-brand-primary transition-all active:scale-95 shadow-sm">
                        {q.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text" value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                        placeholder="Message Nova..."
                        disabled={isTyping}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-6 pr-6 text-[15px] focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all text-white placeholder:text-slate-500 disabled:opacity-50 shadow-inner"
                      />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => sendMessage(input)}
                      disabled={isTyping || !input.trim()}
                      className="w-[56px] h-[56px] rounded-2xl bg-brand-primary flex items-center justify-center text-slate-900 shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:bg-brand-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      {isTyping ? <Zap className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5 ml-0.5" />}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAB Launcher */}
      <div className="fixed bottom-8 right-8 z-[100] font-sans">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-[0_12px_32px_rgba(16,185,129,0.3)] relative group",
            !isOpen ? "bg-brand-primary text-white" : "opacity-0 pointer-events-none"
          )}
        >
          <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
          {unread > 0 && !isOpen && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white shadow-md">
              {unread}
            </motion.div>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default AIChatbot;
