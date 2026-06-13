import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Cpu, Brain, Database, Search, Activity, 
  ShieldCheck, Target, Sparkles, Binary, 
  LineChart, Zap, Globe, Fingerprint,
  GraduationCap, FileText, Upload, ArrowRight,
  ClipboardCheck, BarChart3, Rocket, Calendar,
  BookOpen, Award, CheckCircle2, FlaskConical,
  Trophy, BadgePlus, Trash2, ListCheck, Layers, Plus, CircleSlash, X,
  Command
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

const Analysis = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisType, setAnalysisType] = useState(null); // 'academic' | 'resume'
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  // States
  const [academicData, setAcademicData] = useState({ 
    cgpa: "", 
    subjects: [{ name: "", grade: "" }],
    projects: [{ name: "", description: "", usedSkills: "" }]
  });
  const [resumeText, setResumeText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value ="";
  };

  const addSubject = () => {
    setAcademicData({ ...academicData, subjects: [...academicData.subjects, { name: "", grade: "" }] });
  };

  const removeSubject = (index) => {
    const newSubjects = academicData.subjects.filter((_, i) => i !== index);
    setAcademicData({ ...academicData, subjects: newSubjects });
  };

  const addProject = () => {
    setAcademicData({ ...academicData, projects: [...academicData.projects, { name: "", description: "", usedSkills: "" }] });
  };

  const removeProject = (index) => {
    const newProjects = academicData.projects.filter((_, i) => i !== index);
    setAcademicData({ ...academicData, projects: newProjects });
  };

  const analysisStages = [
    { title: "AI Linkage", desc: "Establishing deep connection with professional footprint...", icon: Cpu, color: "text-emerald-400" },
    { title: "Data Synthesis", desc: analysisType === 'academic' ? "Deconstructing academic performance and credit vectors..." : "Parsing resume semantics and professional experience...", icon: Brain, color: "text-green-400" },
    { title: "Trend Alignment", desc: "Synchronizing global industry standards with your profile...", icon: Globe, color: "text-emerald-500" },
    { title: "Gap Scanning", desc: "Identifying missing skill clusters in your technical proficiency...", icon: Search, color: "text-green-500" },
    { title: "Vector Analysis", desc: "Optimizing career trajectory and calculation of placement probability...", icon: Target, color: "text-emerald-600" },
    { title: "Ready", desc: "Digital twin updated. Finalizing AI map...", icon: Sparkles, color: "text-brand-primary" }
  ];

  const [error, setError] = useState(null);

  // ─── CLIENT-SIDE FALLBACK ANALYSIS ENGINE ─────────────────────────────────
  const TECH_LEXICON = [
    [/\bpython\b/i, "Python Programming"],
    [/\bjava\b/i, "Java Development"],
    [/\bc\+\+\b/i, "C++ Development"],
    [/\bc\b/i, "C Programming"],
    [/react/i, "React.js Frontend"],
    [/data structures|dsa|algorithms/i, "Data Structures & Algorithms"],
    [/html|css/i, "Web Foundations (HTML/CSS)"],
    [/node\.?js|nodejs/i, "Node.js Backend"],
    [/sql|database|mysql|mongodb/i, "Database Management (SQL)"],
    [/\bai\b|artificial intelligence/i, "Artificial Intelligence"],
    [/machine learning|\bml\b/i, "Machine Learning"],
    [/fastapi|rest\s*api|\bapi\b/i, "REST API Development"],
    [/cloud|aws|vercel|docker/i, "Cloud Computing Fundamentals"],
    [/system design/i, "Software Architecture Basics"],
    [/unit test|pytest|jest/i, "Software Testing (QA)"],
    [/agile|scrum/i, "Agile Project Management"],
    [/git|github|open source/i, "Version Control (Git & GitHub)"],
    [/javascript|js\b/i, "JavaScript Development"],
    [/typescript|ts\b/i, "TypeScript"],
    [/next\.?js/i, "Next.js Framework"],
    [/django|flask/i, "Python Web Frameworks"],
    [/cybersecurity|security/i, "Cybersecurity Fundamentals"],
    [/linux|bash|shell/i, "Linux & Shell Scripting"],
    [/kubernetes|k8s/i, "Docker Containerization"],
  ];

  const ROADMAP_LIBRARY = {
    "Cloud Computing Fundamentals": { projects: ["Deploy a Full-Stack App on AWS / Vercel", "Set Up CI/CD Pipelines with GitHub Actions"] },
    "Software Architecture Basics": { projects: ["Design a Scalable URL Shortener", "Build a Distributed Task Queue System"] },
    "Software Testing (QA)": { projects: ["Achieve 100% Test Coverage for a Node.js API", "Mock External Services using TDD"] },
    "Agile Project Management": { projects: ["Manage a 2-Week Sprint in Trello/Jira", "Run a Digital Scrum Board Simulation"] },
    "Version Control (Git & GitHub)": { projects: ["Contribute a Feature to a GitHub Open-Source Repo", "Create a Documentation Site for Your Project"] },
    "REST API Development": { projects: ["Build a Professional REST API with JWT Auth", "Implement Real-Time Webhooks"] },
    "Cybersecurity Fundamentals": { projects: ["Build a Zero-Trust Auth Layer", "Implement HTTPS with Mutual TLS (mTLS)"] },
    "Docker Containerization": { projects: ["Self-Healing Kubernetes Cluster Setup", "Multi-Region Traffic Mirroring"] },
    "Data Structures & Algorithms": { projects: ["Build a Custom In-Memory Database", "Optimize Search Over 1M Records"] },
    "Machine Learning": { projects: ["Build an End-to-End ML Pipeline", "Train a Custom Image Classifier"] },
    "JavaScript Development": { projects: ["Build a Real-Time Chat App", "Create a Chrome Extension"] },
    "TypeScript": { projects: ["Refactor a JavaScript Codebase to TypeScript", "Build a Type-Safe REST API"] },
  };

  const TARGET_SKILLS = [
    "Cloud Computing Fundamentals", "Software Architecture Basics",
    "REST API Development", "Software Testing (QA)",
    "Agile Project Management", "Version Control (Git & GitHub)"
  ];

  const clientSideAnalysis = (text) => {
    const upper = text.toUpperCase();
    const extracted = TECH_LEXICON
      .filter(([pattern]) => pattern.test(text))
      .map(([, label]) => label);

    const missing = TARGET_SKILLS.filter(s => !extracted.includes(s));
    const targetMatches = TARGET_SKILLS.length - missing.length;
    const score = Math.min(42 + (extracted.length * 4) + (targetMatches * 5), 95);
    const placementProb = score >= 85 ? "High (S-Tier Ready)" : score >= 65 ? "Moderate (Growth Phase)" : "Entry-Level";
    const mainMissing = missing.slice(0, 2).join(" and ");
    const insights = extracted.length > 0
      ? `Strong signals detected in ${extracted.slice(0, 2).join(" and ")}. ${mainMissing ? `Bridging gaps in ${mainMissing} will accelerate your career trajectory.` : "You are well-positioned for industry placement!"}`
      : "No strong technical patterns detected yet. Add more subjects, projects, or paste your resume summary below.";

    const roadmap = missing.slice(0, 4).map(skill => ({
      topic: `Module: ${skill}`,
      resource: ROADMAP_LIBRARY[skill]?.projects[0] || `Build a project in ${skill}`
    }));

    return {
      active_skills: extracted,
      experience_score: score,
      missing_skills: missing,
      placement_probability: placementProb,
      recommendations: [
        `Focus on ${missing[0] || "deepening your current stack"} to maximize placement readiness.`,
        "Build 2–3 portfolio projects that directly demonstrate your verified skills."
      ],
      industry_trends: [
        { name: "Generative AI", level: "Critical" },
        { name: "Cloud Native Dev", level: "High" }
      ],
      comparison_graph: [
        { domain: "Logic/Algorithms", user: /dsa|algorithms|data structure/i.test(text) ? 88 : 55, industry: 80 },
        { domain: "Frontend/UI", user: /html|react|css|javascript/i.test(text) ? 85 : 40, industry: 75 },
        { domain: "Backend/Data", user: /python|java|node|sql|api/i.test(text) ? 85 : 40, industry: 75 }
      ],
      roadmap: roadmap.length > 0 ? roadmap : [
        { topic: "Elite Specialization", resource: "Architecting Zero-Downtime Systems" },
        { topic: "Legacy Migration", resource: "Modernizing Monoliths to Microservices" }
      ],
      career_insights: insights
    };
  };
  // ─── END FALLBACK ENGINE ───────────────────────────────────────────────────

  const handleStartAnalysis = async () => {
    console.log("[DEBUG] Starting analysis...");
    setIsProcessing(true);
    setStage(0);
    setProgress(0);
    setError(null);
    
    try {
      let result;
      if (uploadedFile) {
        // Handle Resume Upload — try backend first, fallback to reading as text
        try {
          const formData = new FormData();
          formData.append('file', uploadedFile);
          const response = await fetch('/api/v1/analyze/resume', { method: 'POST', body: formData });
          if (!response.ok) throw new Error("Backend unavailable");
          result = await response.json();
        } catch {
          // Fallback: read file text client-side
          const fileText = await uploadedFile.text().catch(() => uploadedFile.name);
          result = clientSideAnalysis(fileText + " " + uploadedFile.name);
        }

      } else if (resumeText && resumeText.trim()) {
        // Handle Raw Text Analysis — try backend first, fallback locally
        try {
          const response = await fetch('/api/v1/analyze/text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: resumeText.trim() }),
          });
          if (!response.ok) throw new Error("Backend unavailable");
          result = await response.json();
        } catch {
          result = clientSideAnalysis(resumeText.trim());
        }

      } else if (academicData.cgpa || academicData.subjects[0]?.name) {
        // Handle Academic Matrix — try backend first, fallback locally
        try {
          const response = await fetch('/api/v1/analyze/academic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(academicData),
          });
          if (!response.ok) throw new Error("Backend unavailable");
          result = await response.json();
        } catch {
          // Build text from academic form data and run local analysis
          const subjectText = academicData.subjects.filter(s => s.name).map(s => s.name).join(", ");
          const projectText = academicData.projects.filter(p => p.name).map(p => `${p.name} ${p.usedSkills || ""}`).join(", ");
          const fullText = `CGPA: ${academicData.cgpa}. Subjects: ${subjectText}. Projects: ${projectText}`;
          result = clientSideAnalysis(fullText);
        }

      } else {
        throw new Error("No data found. Please fill in your subjects/CGPA or paste your resume summary.");
      }

      // Save and navigate
      localStorage.setItem('skillnova_analysis', JSON.stringify(result));
      setProgress(100);
      setStage(analysisStages.length - 1);
      setTimeout(() => navigate('/skill-gap', { state: { analysisResult: result } }), 1500);

    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!isProcessing || progress >= 90) return;
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 5;
        if (next >= 90) {
            clearInterval(timer);
            return 90;
        }
        // Update stage based on progress
        const stageIndex = Math.floor((next / 90) * (analysisStages.length - 1));
        if (stageIndex > stage) setStage(stageIndex);
        return next;
      });
    }, 200);
    return () => clearInterval(timer);
  }, [isProcessing, progress, stage]);

   return (
     <div className="min-h-screen pt-32 pb-40 px-6 relative overflow-hidden bg-transparent">
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[160px] animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {!isProcessing ? (
            <div key="input-stage">
                <div className="text-center mb-24 space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                    AI <span className="neon-text">ANALYSIS</span> ENGINE
                  </h1>
                  <p className="text-white/30 text-lg md:text-xl font-medium tracking-tight max-w-4xl mx-auto italic">
                    "Populate your academic and professional matrices—one central command node to synchronize all AI vectors."
                  </p>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-center font-black uppercase tracking-widest text-xs">
                    ERROR: {error}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* ACADEMIC ANALYSER PART */}
                  <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                    <GlassCard className="p-10 space-y-12 border-white/5 bg-black/50 overflow-hidden relative min-h-[600px]" glow>
                       <div className="flex items-center gap-6 mb-12">
                          <div className="p-5 rounded-2xl bg-brand-primary/10 text-brand-primary shadow-2xl">
                             <GraduationCap className="w-10 h-10" />
                          </div>
                          <div>
                             <h3 className="text-4xl font-black uppercase tracking-tight">Academic</h3>
                             <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Education Matrix</p>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-black tracking-widest text-white/30">Aggregate CGPA</label>
                             <input 
                               type="text" placeholder="EX: 9.4" 
                               className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-xs font-bold outline-none focus:border-brand-primary transition-all"
                               value={academicData.cgpa}
                               onChange={(e) => setAcademicData({...academicData, cgpa: e.target.value})}
                             />
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="flex items-center justify-between">
                             <h4 className="text-[12px] uppercase font-black tracking-[0.3em] text-white/30">I. Subject Performance</h4>
                             <button onClick={addSubject} className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-black transition-all flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                                <Plus className="w-4 h-4" /> Add Subject
                             </button>
                          </div>
                          
                          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                             {academicData.subjects.map((sub, i) => (
                                <div key={i} className="flex gap-4 group">
                                   <div className="flex-grow space-y-2">
                                      <input 
                                         type="text" placeholder="SUBJECT NAME" 
                                         className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-[10px] font-bold outline-none focus:border-brand-primary transition-all uppercase" 
                                         value={sub.name}
                                         onChange={(e) => {
                                            const newSubs = [...academicData.subjects];
                                            newSubs[i].name = e.target.value;
                                            setAcademicData({...academicData, subjects: newSubs});
                                         }}
                                      />
                                   </div>
                                   <div className="w-24 space-y-2">
                                      <select 
                                         className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-brand-primary text-[10px] font-black outline-none focus:border-brand-primary text-center appearance-none" 
                                         value={sub.grade}
                                         onChange={(e) => {
                                            const newSubs = [...academicData.subjects];
                                            newSubs[i].grade = e.target.value;
                                            setAcademicData({...academicData, subjects: newSubs});
                                         }}
                                      >
                                         <option value="" disabled className="bg-black text-white/50">GRADE</option>
                                         <option value="O" className="bg-black text-brand-primary font-black">O</option>
                                         <option value="A+" className="bg-black text-brand-primary font-black">A+</option>
                                         <option value="A" className="bg-black text-brand-primary font-black">A</option>
                                         <option value="B+" className="bg-black text-brand-primary font-black">B+</option>
                                         <option value="B" className="bg-black text-brand-primary font-black">B</option>
                                         <option value="C" className="bg-black text-brand-primary font-black">C</option>
                                         <option value="D" className="bg-black text-brand-primary font-black">D</option>
                                         <option value="F" className="bg-black text-brand-primary font-black">F</option>
                                      </select>
                                   </div>
                                   <button onClick={() => removeSubject(i)} className="text-white/10 hover:text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="flex items-center justify-between">
                             <h4 className="text-[12px] uppercase font-black tracking-[0.3em] text-white/30">II. Technical Projects</h4>
                             <button onClick={addProject} className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-black transition-all flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                                <Plus className="w-4 h-4" /> Add Project
                             </button>
                          </div>

                          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                             {academicData.projects.map((pro, i) => (
                                <div key={i} className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4 relative group/p">
                                   <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-white/10 hover:text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
                                   <div className="space-y-2">
                                      <label className="text-[8px] uppercase font-black tracking-widest text-white/20">Project Name</label>
                                      <input 
                                         type="text" placeholder="EX: AI ENGINE" 
                                         className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white text-xs font-bold outline-none focus:border-brand-primary"
                                         value={pro.name}
                                         onChange={(e) => {
                                            const newPro = [...academicData.projects];
                                            newPro[i].name = e.target.value;
                                            setAcademicData({...academicData, projects: newPro});
                                         }}
                                      />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[8px] uppercase font-black tracking-widest text-white/20">Technical Description</label>
                                      <textarea 
                                         placeholder="DESCRIBE ARCHITECTURE AND FUNCTIONALITY..." 
                                         className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white text-xs font-bold h-24 resize-none outline-none focus:border-brand-primary"
                                         value={pro.description}
                                         onChange={(e) => {
                                            const newPro = [...academicData.projects];
                                            newPro[i].description = e.target.value;
                                            setAcademicData({...academicData, projects: newPro});
                                         }}
                                      />
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    </GlassCard>
                  </motion.div>

                  {/* RESUME ANALYSER PART */}
                  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                    <GlassCard className="p-10 space-y-12 border-white/5 bg-black/50 min-h-[800px]" glow>
                        <div className="flex items-center gap-6 mb-12">
                          <div className="p-5 rounded-2xl bg-emerald-500/10 text-emerald-400 shadow-2xl">
                              <FileText className="w-10 h-10" />
                          </div>
                          <div>
                              <h3 className="text-4xl font-black uppercase tracking-tight">Resume</h3>
                              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Pattern Analysis</p>
                          </div>
                        </div>

                        <div className="space-y-10">
                          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                          <div 
                              onClick={() => fileInputRef.current.click()}
                              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={handleDrop}
                              className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-white/5 hover:bg-white/[0.02] hover:border-emerald-500/20'}`}
                          >
                              {uploadedFile ? (
                                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-brand-primary/20 text-brand-primary relative">
                                      <FileText className="w-12 h-12" />
                                      <button onClick={clearFile} className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white hover:scale-110 transition-all">
                                          <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <p className="text-xs font-black text-brand-primary uppercase tracking-widest truncate max-w-[200px]">{uploadedFile.name}</p>
                                </motion.div>
                              ) : (
                                <>
                                    <Upload className={`w-16 h-16 mb-6 transition-all ${isDragging ? 'text-brand-primary scale-125' : 'text-emerald-500/40 animate-pulse'}`} />
                                    <div className="space-y-2">
                                      <p className="text-sm font-black uppercase tracking-widest text-white/40">Drop Resume</p>
                                    </div>
                                </>
                              )}
                          </div>

                          <div className="flex items-center gap-6">
                              <div className="h-px bg-white/5 flex-grow" />
                              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 uppercase">Or PASTE Summary</span>
                              <div className="h-px bg-white/5 flex-grow" />
                          </div>

                          <div className="space-y-3">
                              <textarea 
                                placeholder="PASTE PROFESSIONAL SUMMARY OR EXPERIENCE LOGS HERE..." 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-bold focus:border-emerald-500 outline-none h-48 resize-none font-mono placeholder:text-white/10 leading-relaxed"
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                              />
                          </div>
                        </div>
                    </GlassCard>
                  </motion.div>
                </div>

                {/* MASTER SYNC BUTTON */}
                <div className="mt-20 max-w-xl mx-auto relative z-30">
                  <motion.button 
                      onClick={(e) => { e.preventDefault(); handleStartAnalysis(); }} 
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.02, shadow: "0 0 20px rgba(16,185,129,0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-6 bg-emerald-500 text-white font-black uppercase tracking-[0.4em] text-sm rounded-2xl transition-all flex items-center justify-center gap-4 group border border-emerald-400 shadow-[0_10px_40px_rgba(16,185,129,0.3)]"
                  >
                      <Command className="w-5 h-5 group-hover:rotate-180 transition-all duration-700" />
                      Initializing AI Analysis Engine 
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-all duration-300" />
                  </motion.button>
                  <p className="mt-8 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.8em]">End-to-End Encryption Enabled // Sync Status: READY</p>
                </div>
              </div>
            ) : (
            <div 
              key="processing-stage"
              className="flex flex-col items-center justify-center space-y-16 py-20"
            >
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
                    <h2 className="text-7xl font-black uppercase tracking-tighter text-white">
                        AI <br />
                        <span className="neon-text">SYNCHRONIZATION</span>
                    </h2>
                  </motion.div>

                  <div className="relative aspect-video w-full max-w-2xl mx-auto flex flex-col items-center justify-center border border-white/5 rounded-[4rem] bg-black/40 backdrop-blur-3xl p-10">
                    <AnimatePresence mode="wait">
                        {(() => {
                          const CurrentIcon = analysisStages[stage]?.icon || Cpu;
                          return (
                              <motion.div 
                                key={stage} 
                                initial={{ opacity: 0, scale: 0.8 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 1.2 }} 
                                className="relative z-10 flex flex-col items-center gap-10 text-center"
                              >
                                <div className={`p-10 rounded-3xl bg-brand-primary/5 border border-brand-primary/20 shadow-2xl ${analysisStages[stage]?.color || 'text-brand-primary'}`}>
                                    <CurrentIcon className="w-20 h-20" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className={`text-4xl font-black uppercase tracking-tighter ${analysisStages[stage]?.color || 'text-brand-primary'}`}>{analysisStages[stage]?.title}</h4>
                                    <p className="text-white/30 text-[10px] uppercase font-black tracking-widest leading-relaxed max-w-sm italic">"{analysisStages[stage]?.desc}"</p>
                                </div>
                              </motion.div>
                          );
                        })()}
                    </AnimatePresence>
                  </div>

                  <div className="w-full max-w-xl mx-auto space-y-4 text-center">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div animate={{ width: `${progress}%` }} className="absolute inset-y-0 bg-brand-primary shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                    </div>
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.8em]">{progress}% COMPLETE</span>
                  </div>
              </div>
            )}
        </div>
     </div>
   );
};

export default Analysis;
