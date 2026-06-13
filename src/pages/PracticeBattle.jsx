import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  Cpu, Brain, Target, Sparkles, Rocket, Clock, 
  Trophy, Activity, ShieldCheck, Zap, Globe, 
  AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, RefreshCw, 
  LayoutDashboard, Swords, Timer, Award, Lightbulb, X, CircleSlash, Flag, Trash2,
  Terminal, BarChart3, Radio
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

// NEW SUCCESS EFFECT: Success Beam Component
const SuccessBeam = ({ x }) => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 1, x: x }}
      animate={{ height: "200%", opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute bottom-0 w-2 bg-gradient-to-t from-brand-primary to-transparent z-40 pointer-events-none blur-sm"
    />
  );
};

const PracticeBattle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultSubject = location.state?.defaultSubject || "Python";

  const [view, setView] = useState("setup"); 
  const [difficulty, setDifficulty] = useState("Medium");
  const [subject, setSubject] = useState(defaultSubject);
  const [battleTime, setBattleTime] = useState(600); 
  const [timeLeft, setTimeLeft] = useState(600);
  const [score, setScore] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState(null); 
  const [accuracy, setAccuracy] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [countdown, setCountdown] = useState(null);

  const [subjects, setSubjects] = useState(() => {
    const base = [
      "Python", "Java", "C", "SQL", "DSA", 
      "HTML", "CSS", "JSX", "Math", 
      "Reasoning", "Aptitude", "Verbal Ability"
    ];
    if (defaultSubject !== "Python" && !base.includes(defaultSubject)) {
      base.unshift(defaultSubject);
    }
    return base;
  });

  

  // FORCE SCROLL TO TOP ON VIEW CHANGE 
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  useEffect(() => {
    if (view === 'battle' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && view === 'battle') {
      finishBattle();
    }
  }, [view, timeLeft]);

  const handleAnswer = (optString) => {
    if (userAnswers[currentQuestion] !== undefined) return; 

    setUserAnswers(prev => ({ ...prev, [currentQuestion]: optString }));

    // AI String Matching Robustness
    const selected = String(optString).trim().toLowerCase();
    const correct = String(activeQuestions[currentQuestion]?.answer).trim().toLowerCase();

    // Direct match or partial subset match prevents AI hallucination failures
    if (selected === correct || selected.includes(correct) || correct.includes(selected)) {
      setScore(s => s + 100);
      setFeedback("correct");
      setTimeout(() => setFeedback(null), 1500);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const finishBattle = () => {
    const correctCount = Math.round(score / 100);
    const finalAccuracy = Math.round((correctCount / (activeQuestions.length || 1)) * 100);
    setAccuracy(finalAccuracy);

    // Sync Roadmap Progress Automatically
    if (location.state?.stepId && location.state?.domain) {
       if (finalAccuracy >= 50) { 
          const domain = location.state.domain;
          const progKey = `roadmap_progression_${domain}`;
          const savedProgress = localStorage.getItem(progKey);
          
          if (savedProgress) {
             let steps = JSON.parse(savedProgress);
             steps = steps.map((s, index) => {
                 if (s.id === location.state.stepId) return { ...s, status: "Completed" };
                 if (index > 0 && steps[index - 1].id === location.state.stepId && s.status === "Locked") return { ...s, status: "In Progress" };
                 return s;
             });
             localStorage.setItem(progKey, JSON.stringify(steps));
          }
       }
    }

    // Save last battle result for Dashboard
    localStorage.setItem('skillnova_last_battle', JSON.stringify({
      accuracy: finalAccuracy,
      subject,
      difficulty,
      score,
      timestamp: new Date().toISOString()
    }));

    setView("results");
  };

  const nextQuestion = () => (currentQuestion < activeQuestions.length - 1) && setCurrentQuestion(c => c + 1);
  const prevQuestion = () => (currentQuestion > 0) && setCurrentQuestion(c => c - 1);
  const formatTime = (seconds) => `${Math.floor(seconds/60)}:${(seconds%60).toString().padStart(2,'0')}`;

  // 1. SETUP VIEW (REDUCED)
  if (view === "setup") {
    return (
      <div className="min-h-screen pt-24 pb-32 px-6 relative bg-transparent overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#020617] opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 blur-[160px] rounded-full animate-pulse" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-12">
             <div className="flex items-center justify-center gap-4 md:gap-12 group">
               <motion.div initial={{ x: -30, opacity: 0, scale: 0.5 }} animate={{ x: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: "spring" }}>
                 <Swords className="w-10 h-10 md:w-16 md:h-16 text-brand-primary/20 group-hover:text-brand-primary transition-all duration-500 animate-pulse drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
               </motion.div>
               
               <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white relative">
                 PRACTICE <span className="text-brand-primary drop-shadow-[0_0_20px_rgba(16, 185, 129,0.5)]">BATTLE</span>
                 <div className="absolute -bottom-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent blur-sm" />
               </h1>

               <motion.div initial={{ x: 30, opacity: 0, scale: 0.5 }} animate={{ x: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: "spring" }}>
                 <ShieldCheck className="w-10 h-10 md:w-16 md:h-16 text-brand-primary/20 group-hover:text-brand-primary transition-all duration-500 animate-pulse drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
               </motion.div>
             </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
             <div className="lg:col-span-8 space-y-8">
                <GlassCard className="p-6 border-brand-primary/10 bg-brand-primary/5 space-y-12 overflow-hidden relative" glow>
                   <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-brand-primary flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center backdrop-blur-md">
                              <Zap className="w-4 h-4" />
                           </div>
                           MISSION_DIFFICULTY
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                         {["Easy", "Medium", "Hard"].map(lvl => (
                            <button 
                               key={lvl} onClick={() => setDifficulty(lvl)}
                                className={`py-6 rounded-2xl border font-black uppercase tracking-widest text-sm transition-all ${difficulty === lvl ? 'bg-white/20 border-white/40 text-white shadow-[0_0_40px_rgba(16,185,129,0.2)] backdrop-blur-xl' : 'bg-white/5 border-white/5 text-white/20 hover:bg-brand-primary/10'}`}
                            >
                               {lvl}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-brand-primary flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center backdrop-blur-md">
                              <Target className="w-4 h-4" />
                           </div>
                           _VECTOR_SUBJECT
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                         {subjects.map(subj => (
                            <button 
                               key={subj} onClick={() => setSubject(subj)}
                               className={`p-4 rounded-xl border transition-all text-center ${subject === subj ? 'border-brand-primary bg-brand-primary/20 text-brand-primary' : 'border-white/5 bg-white/5 text-white/30'}`}
                            >
                               <h4 className="text-xs font-black uppercase tracking-[0.1em]">{subj}</h4>
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-brand-primary flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center backdrop-blur-md">
                              <Timer className="w-4 h-4" />
                           </div>
                           SYNC_DURATION
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                         {[{l:"5 MINS",v:300},{l:"10 MINS",v:600},{l:"15 MINS",v:900}].map(t => (
                            <button 
                               key={t.l} onClick={() => setBattleTime(t.v)}
                                className={`py-6 rounded-2xl border font-black uppercase tracking-widest text-sm transition-all ${battleTime === t.v ? 'bg-white/20 border-white/40 text-white shadow-[0_0_40px_rgba(16,185,129,0.2)] backdrop-blur-xl' : 'bg-white/5 border-white/5 text-white/20 hover:bg-brand-primary/10'}`}
                            >
                               {t.l}
                            </button>
                         ))}
                      </div>
                   </div>
                </GlassCard>
             </div>

             <div className="lg:col-span-4 h-full">
                <GlassCard className="p-6 h-full border-brand-primary/20 bg-brand-primary/5 flex flex-col justify-between overflow-hidden relative" glow>
                   <div className="space-y-12 relative z-10">
                       <div className="flex items-center justify-between border-b border-white/5 pb-6">
                         <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-white/20">Operational Node</p>
                            <h4 className="text-4xl font-black uppercase text-brand-primary tracking-tighter leading-none">BATTLE_SYNC</h4>
                         </div>
                          <div className="w-12 h-12 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center backdrop-blur-md">
                             <Cpu className="w-6 h-6 text-brand-primary animate-pulse" />
                          </div>
                      </div>

                      <div className="space-y-6">
                         {[
                            { label: "Subject", value: subject, icon: Terminal },
                            { label: "Tier", value: difficulty, icon: Zap },
                            { label: "Duration", value: `${battleTime/60}m`, icon: Clock }
                         ].map((item, i) => (
                             <div key={i} className="flex justify-between items-center bg-white/[0.03] p-4 rounded-xl border border-white/5">
                                <div className="flex items-center gap-4">
                                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                      <item.icon className="w-4 h-4 text-brand-primary" />
                                   </div>
                                   <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">{item.label}</span>
                                </div>
                                <span className="text-sm font-black text-white uppercase tracking-widest">{item.value}</span>
                             </div>
                         ))}
                      </div>
                   </div>

                    <div className="relative mt-20">
                       <motion.button 
                         whileHover={{ scale: 1.05, shadow: "0 0 80px rgba(255,255,255,0.3)" }} 
                         animate={{ scale: [1, 1.02, 1] }}
                         transition={{ scale: { repeat: Infinity, duration: 2 } }}
                         whileTap={{ scale: 0.95 }}
                         onClick={async () => {
                            setCountdown("PULSING AI ENGINE...");
                            setActiveQuestions([]);
                            setCurrentQuestion(0);
                            setUserAnswers({});
                            setScore(0);
                            
                             // ── OFFLINE QUIZ BANK ──────────────────────────────
                             const QUIZ_BANK = {
                               PYTHON: [
                                 { question: "What is a list comprehension in Python?", options: ["A compact way to create lists", "A type of loop", "A class method", "A built-in function"], answer: "A compact way to create lists" },
                                 { question: "How do you define a function in Python?", options: ["def my_func():", "function my_func():", "func my_func():", "create my_func():"], answer: "def my_func():" },
                                 { question: "Which keyword handles exceptions in Python?", options: ["except", "catch", "error", "handle"], answer: "except" },
                                 { question: "Which data structure is LIFO in Python?", options: ["Stack", "Queue", "List", "Dict"], answer: "Stack" },
                                 { question: "What does 'len()' return?", options: ["Length of an object", "Last element", "Type of object", "Memory address"], answer: "Length of an object" },
                                 { question: "Which of these is immutable in Python?", options: ["Tuple", "List", "Dictionary", "Set"], answer: "Tuple" },
                                 { question: "What is the output of 2**3 in Python?", options: ["8", "6", "9", "5"], answer: "8" },
                                 { question: "How do you open a file in Python?", options: ["open('file.txt')", "file.open('file.txt')", "read('file.txt')", "load('file.txt')"], answer: "open('file.txt')" },
                                 { question: "Which library is used for data manipulation in Python?", options: ["pandas", "numpy", "flask", "django"], answer: "pandas" },
                                 { question: "What does 'self' refer to in a Python class?", options: ["The current instance", "The class itself", "The parent class", "A static method"], answer: "The current instance" },
                               ],
                               JAVA: [
                                 { question: "What is the size of int in Java?", options: ["4 bytes", "2 bytes", "8 bytes", "Depends on OS"], answer: "4 bytes" },
                                 { question: "Which keyword is used for inheritance in Java?", options: ["extends", "implements", "inherits", "super"], answer: "extends" },
                                 { question: "Is Java pass-by-value or pass-by-reference?", options: ["Pass-by-value", "Pass-by-reference", "Both", "Neither"], answer: "Pass-by-value" },
                                 { question: "What is the root class of all Java classes?", options: ["Object", "Class", "Main", "String"], answer: "Object" },
                                 { question: "Which access modifier is most restrictive?", options: ["private", "public", "protected", "default"], answer: "private" },
                                 { question: "What is a constructor in Java?", options: ["A method with same name as class", "A static method", "An interface", "A final method"], answer: "A method with same name as class" },
                                 { question: "Which collection allows duplicate elements?", options: ["ArrayList", "HashSet", "TreeSet", "LinkedHashSet"], answer: "ArrayList" },
                                 { question: "What does JVM stand for?", options: ["Java Virtual Machine", "Java Variable Method", "Java Verified Module", "Java Vector Memory"], answer: "Java Virtual Machine" },
                                 { question: "Which keyword prevents method overriding?", options: ["final", "static", "abstract", "private"], answer: "final" },
                                 { question: "What is autoboxing in Java?", options: ["Auto-converting primitives to wrapper objects", "Automatic memory allocation", "Auto garbage collection", "Boxing variables in arrays"], answer: "Auto-converting primitives to wrapper objects" },
                               ],
                               C: [
                                 { question: "What does malloc() do in C?", options: ["Allocates memory dynamically", "Frees memory", "Opens a file", "Prints output"], answer: "Allocates memory dynamically" },
                                 { question: "How do you declare a pointer in C?", options: ["int *ptr;", "int ptr;", "pointer ptr;", "int ptr*;"], answer: "int *ptr;" },
                                 { question: "Which header is used for I/O in C?", options: ["<stdio.h>", "<stdlib.h>", "<conio.h>", "<math.h>"], answer: "<stdio.h>" },
                                 { question: "What is the return type of main() in C?", options: ["int", "void", "float", "char"], answer: "int" },
                                 { question: "Which operator is logical AND in C?", options: ["&&", "||", "AND", "&"], answer: "&&" },
                                 { question: "What does 'sizeof' operator return?", options: ["Size in bytes", "Size in bits", "Number of elements", "Memory address"], answer: "Size in bytes" },
                                 { question: "What is a segmentation fault?", options: ["Accessing invalid memory", "Stack overflow", "Syntax error", "Division by zero"], answer: "Accessing invalid memory" },
                                 { question: "Which loop executes at least once?", options: ["do-while", "while", "for", "All of them"], answer: "do-while" },
                                 { question: "What does 'break' do in a loop?", options: ["Exits the loop", "Skips iteration", "Restarts loop", "Pauses execution"], answer: "Exits the loop" },
                                 { question: "What is a struct in C?", options: ["A user-defined data type", "A built-in function", "A loop construct", "A pointer type"], answer: "A user-defined data type" },
                               ],
                               SQL: [
                                 { question: "Which SQL statement retrieves data?", options: ["SELECT", "GET", "FETCH", "EXTRACT"], answer: "SELECT" },
                                 { question: "Which clause filters rows?", options: ["WHERE", "HAVING", "GROUP BY", "FILTER"], answer: "WHERE" },
                                 { question: "Which SQL keyword removes duplicates?", options: ["DISTINCT", "UNIQUE", "DIFFERENT", "ONLY"], answer: "DISTINCT" },
                                 { question: "Which JOIN returns all rows from both tables?", options: ["FULL OUTER JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN"], answer: "FULL OUTER JOIN" },
                                 { question: "What does GROUP BY do?", options: ["Groups rows with same values", "Sorts rows", "Filters rows", "Joins tables"], answer: "Groups rows with same values" },
                                 { question: "Which function counts rows?", options: ["COUNT()", "SUM()", "TOTAL()", "ROWS()"], answer: "COUNT()" },
                                 { question: "What is a PRIMARY KEY?", options: ["Uniquely identifies a row", "A foreign reference", "A calculated field", "An index"], answer: "Uniquely identifies a row" },
                                 { question: "Which SQL command modifies existing data?", options: ["UPDATE", "MODIFY", "CHANGE", "ALTER"], answer: "UPDATE" },
                                 { question: "What is a FOREIGN KEY?", options: ["A key referencing another table's primary key", "A unique index", "An encrypted key", "A composite key"], answer: "A key referencing another table's primary key" },
                                 { question: "Which SQL clause is used with aggregate functions?", options: ["HAVING", "WHERE", "GROUP", "ORDER BY"], answer: "HAVING" },
                               ],
                               DSA: [
                                 { question: "Which data structure is used for BFS?", options: ["Queue", "Stack", "Tree", "Heap"], answer: "Queue" },
                                 { question: "Worst-case time of Quick Sort?", options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], answer: "O(n²)" },
                                 { question: "Which structure uses FIFO?", options: ["Queue", "Stack", "Array", "Graph"], answer: "Queue" },
                                 { question: "What is a complete binary tree?", options: ["All levels filled except possibly last", "Every node has 2 children", "All leaves at same level", "Only root node exists"], answer: "All levels filled except possibly last" },
                                 { question: "Time complexity of Binary Search?", options: ["O(log n)", "O(n)", "O(n²)", "O(1)"], answer: "O(log n)" },
                                 { question: "Which sorting is stable?", options: ["Merge Sort", "Quick Sort", "Heap Sort", "Selection Sort"], answer: "Merge Sort" },
                                 { question: "What is a hash collision?", options: ["Two keys map to same hash", "Memory overflow", "Null pointer error", "Stack overflow"], answer: "Two keys map to same hash" },
                                 { question: "What does DFS stand for?", options: ["Depth First Search", "Data Fetch System", "Dynamic Function Search", "Direct File Sort"], answer: "Depth First Search" },
                                 { question: "Which data structure is used for undo operations?", options: ["Stack", "Queue", "Graph", "Tree"], answer: "Stack" },
                                 { question: "Best case of Bubble Sort?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: "O(n)" },
                               ],
                               HTML: [
                                 { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: "Hyper Text Markup Language" },
                                 { question: "Which tag creates the largest heading?", options: ["<h1>", "<h6>", "<head>", "<title>"], answer: "<h1>" },
                                 { question: "Which tag creates a hyperlink?", options: ["<a>", "<link>", "<href>", "<url>"], answer: "<a>" },
                                 { question: "Which tag displays an image?", options: ["<img>", "<image>", "<pic>", "<photo>"], answer: "<img>" },
                                 { question: "Which tag creates a line break?", options: ["<br>", "<lb>", "<break>", "<newline>"], answer: "<br>" },
                                 { question: "Which tag creates an ordered list?", options: ["<ol>", "<ul>", "<li>", "<list>"], answer: "<ol>" },
                                 { question: "Which attribute specifies CSS class?", options: ["class", "id", "style", "name"], answer: "class" },
                                 { question: "Which tag defines a table row?", options: ["<tr>", "<td>", "<th>", "<row>"], answer: "<tr>" },
                                 { question: "Which input type creates a checkbox?", options: ["checkbox", "check", "tick", "box"], answer: "checkbox" },
                                 { question: "Which tag is used for bold text?", options: ["<strong>", "<bold>", "<b>", "<em>"], answer: "<strong>" },
                               ],
                               CSS: [
                                 { question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Colorful Style Scripts"], answer: "Cascading Style Sheets" },
                                 { question: "Which property changes text color?", options: ["color", "text-color", "font-color", "foreground"], answer: "color" },
                                 { question: "Which selector targets an element by ID?", options: ["#id", ".id", "*id", "id"], answer: "#id" },
                                 { question: "Which property controls spacing inside an element?", options: ["padding", "margin", "border", "spacing"], answer: "padding" },
                                 { question: "How do you apply a CSS file to HTML?", options: ["<link rel='stylesheet'>", "<style src=''>", "<css href=''>", "<import css=''>"], answer: "<link rel='stylesheet'>" },
                                 { question: "What is the default display of a <div>?", options: ["block", "inline", "flex", "grid"], answer: "block" },
                                 { question: "Which property makes an element invisible but occupies space?", options: ["visibility: hidden", "display: none", "opacity: 0", "z-index: -1"], answer: "visibility: hidden" },
                                 { question: "What does 'z-index' control?", options: ["Stack order of elements", "Zoom level", "Font size", "Element width"], answer: "Stack order of elements" },
                                 { question: "Which property creates rounded corners?", options: ["border-radius", "corner-radius", "round-border", "edge-radius"], answer: "border-radius" },
                                 { question: "What is the CSS box model?", options: ["Content, padding, border, margin", "Width, height, color, font", "Display, position, float, clear", "Top, right, bottom, left"], answer: "Content, padding, border, margin" },
                               ],
                               DEFAULT: [
                                 { question: "What is the core principle of software engineering?", options: ["Scalability and Efficiency", "Speed over correctness", "Avoiding documentation", "Hardcoding values"], answer: "Scalability and Efficiency" },
                                 { question: "Which optimization technique avoids redundant calculations?", options: ["Caching and Memoization", "Code duplication", "Synchronous blocking", "Overhead injection"], answer: "Caching and Memoization" },
                                 { question: "What is the primary focus of debugging?", options: ["State and variable memory", "CPU temperature", "Monitor refresh rate", "Keyboard layout"], answer: "State and variable memory" },
                                 { question: "How are architectural patterns applied?", options: ["Separating concerns and modularizing logic", "Writing everything in one file", "Deleting old variables", "Bypassing security"], answer: "Separating concerns and modularizing logic" },
                                 { question: "Why is version control critical?", options: ["Track history and enable collaboration", "Make apps run faster", "Reduce file size", "Increase RAM"], answer: "Track history and enable collaboration" },
                                 { question: "What represents a memory leak risk?", options: ["Unreferenced listeners and open sockets", "Printing to console", "Using comments", "Writing tests"], answer: "Unreferenced listeners and open sockets" },
                                 { question: "What is the advantage of strict typing?", options: ["Compile-time error catching", "Faster runtime", "No documentation needed", "Unlimited scopes"], answer: "Compile-time error catching" },
                                 { question: "How should credentials be handled?", options: ["Environment variables and Vaults", "Hardcoded in code", "Written in docs", "Stored in text files"], answer: "Environment variables and Vaults" },
                                 { question: "Best approach for horizontal scaling?", options: ["Stateless instances with load balancing", "One large server", "Storing sessions in memory", "Disabling firewalls"], answer: "Stateless instances with load balancing" },
                                 { question: "Which paradigm is best for I/O operations?", options: ["Asynchronous Non-Blocking", "Single-threaded synchronous", "Manual deallocation", "Infinite recursion"], answer: "Asynchronous Non-Blocking" },
                               ],
                             };

                             const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

                             try {
                                 const res = await fetch("/api/generate-quiz", {
                                     method: "POST",
                                     headers: { "Content-Type": "application/json" },
                                     body: JSON.stringify({ subject, difficulty }),
                                 });
                                 const data = await res.json();
                                 if (data?.questions?.length > 0) {
                                   setActiveQuestions(data.questions);
                                 } else {
                                   throw new Error("Empty response");
                                 }
                             } catch {
                                 // Fallback to offline quiz bank
                                 const key = subject.toUpperCase().replace(/[^A-Z]/g, "");
                                 const bank = QUIZ_BANK[key] || QUIZ_BANK["DEFAULT"];
                                 setActiveQuestions(shuffle(bank).slice(0, 10));
                             }

                            setCountdown(3);
                            const timer = setInterval(() => {
                               setCountdown(prev => {
                                  if (prev === 1) {
                                     clearInterval(timer);
                                     setTimeout(() => {
                                        setCountdown(null);
                                        setTimeLeft(battleTime); 
                                        setView("battle");
                                     }, 1000);
                                     return "GO!";
                                  }
                                  if (typeof prev === "string") return 3;
                                  return prev - 1;
                               });
                            }, 1000);
                         }}
                         className="w-full py-6 bg-brand-primary/10 border border-brand-primary/20 backdrop-blur-3xl text-white font-black uppercase tracking-[0.5em] text-[10px] rounded-[3rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] group"
                       >
                         Initiate Combat <Rocket className="inline-block ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                       </motion.button>
                    </div>

                    {/* Neural Countdown Overlay */}
                    <AnimatePresence>
                       {countdown !== null && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6"
                          >
                             <div className="absolute inset-0 z-0">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 blur-[150px] rounded-full animate-pulse" />
                             </div>
                             
                             <div className="relative z-10 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[1em] text-brand-primary/40 mb-12">Synchronizing Tactical Node</p>
                                <motion.div 
                                  key={countdown}
                                  initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
                                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                  className={typeof countdown === "number" || countdown === "GO!" ? "text-[8rem] font-black text-white leading-none tracking-tighter italic" : "text-4xl font-black text-brand-primary tracking-[0.2em] uppercase animate-pulse drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"}
                                >
                                   {countdown}
                                </motion.div>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 mt-12">Prepare for Engagement</p>
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                </GlassCard>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. BATTLE VIEW (REDUCED)
  if (view === "battle") {
    return (
      <div className="min-h-screen pt-20 bg-[#020617] flex items-center justify-center relative overflow-hidden">
        {feedback === 'correct' && <SuccessBeam x="50%" />}
        
        <div className="max-w-3xl w-full px-6 relative z-10 space-y-8">
           <div className="flex justify-between items-center bg-black/60 border border-brand-primary/20 rounded-[2.5rem] p-6 backdrop-blur-3xl">
              <div className="flex items-center gap-12">
                 <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Sync Timer</p>
                    <div className={`text-3xl font-black font-mono tracking-tighter ${timeLeft < 60 ? 'text-brand-primary animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</div>
                 </div>
                 <div className="h-10 w-px bg-brand-primary/10" />
                 <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Engagement XP</p>
                    <div className="text-3xl font-black font-mono tracking-tighter text-white">{score.toLocaleString()}</div>
                 </div>
              </div>
              <div className="text-right">
                 <span className="text-[10px] font-black text-white bg-brand-primary/10 border border-brand-primary/20 px-6 py-2 rounded-full uppercase tracking-[0.5em]">{subject}</span>
              </div>
           </div>

           <AnimatePresence mode="wait">
              <motion.div key={currentQuestion} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                 <GlassCard className={`p-10 border-brand-primary/20 bg-black/80 relative overflow-hidden transition-all duration-500`} glow>
                     <AnimatePresence>
                        {feedback === 'correct' && (
                           <motion.div 
                             initial={{ opacity: 0, scale: 0.5, letterSpacing: "2em" }} 
                             animate={{ opacity: 1, scale: 1, letterSpacing: "1em" }} 
                             exit={{ opacity: 0, scale: 2 }}
                             className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none italic"
                           >
                              <div className="text-brand-primary font-black text-6xl uppercase drop-shadow-[0_0_40px_rgba(16,185,129,0.8)] px-12 py-6 border-y-2 border-brand-primary/40 bg-brand-primary/5 backdrop-blur-3xl animate-pulse">CORRECT!</div>
                           </motion.div>
                        )}
                        {feedback === 'wrong' && (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-red-500/5 transition-all"><X className="w-32 h-32 text-red-500 opacity-20 animate-shake" /></motion.div>
                        )}
                     </AnimatePresence>

                    <div className="space-y-10 relative z-20">
                       <div className="flex justify-between items-center border-b border-white/5 pb-6">
                          <span className="text-[10px] font-black uppercase tracking-[1em] text-white/10">MISSION_{currentQuestion + 1}</span>
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{currentQuestion+1}/{activeQuestions.length}</span>
                       </div>
                       
                       <h2 className={`text-2xl md:text-3xl font-black leading-tight text-white tracking-tight drop-shadow-lg transition-all ${feedback === 'correct' ? 'blur-md opacity-20' : ''}`}>
                          {activeQuestions[currentQuestion]?.question || "Processing Mission..."}
                       </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {activeQuestions[currentQuestion]?.options?.map((opt, i) => (
                              <motion.button 
                                 key={i} onClick={() => handleAnswer(opt)} disabled={userAnswers[currentQuestion] !== undefined}
                                 whileHover={{ scale: 1.02 }}
                                 className={`p-6 text-left border rounded-2xl transition-all flex items-center gap-6 group ${userAnswers[currentQuestion] === opt ? (opt === activeQuestions[currentQuestion]?.answer ? 'border-white bg-white/20 shadow-[0_0_20_rgba(255,255,255,0.3)] backdrop-blur-md' : 'border-red-500 bg-brand-primary/10') : 'border-white/5 bg-white/[0.02] hover:border-white/40'}`}
                              >
                                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/30 group-hover:text-white transition-all">{i+1}</div>
                                 <span className="text-[13px] font-black text-white/50 group-hover:text-white transition-all uppercase tracking-widest leading-relaxed">{opt}</span>
                              </motion.button>
                           ))}
                        </div>

                        {userAnswers[currentQuestion] !== undefined && (
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 space-y-3">
                              <div className="flex items-center gap-3 text-brand-primary">
                                 <div className="w-8 h-8 rounded-lg bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center backdrop-blur-md">
                                     <Lightbulb className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Technical Briefing</span>
                               </div>
                              <p className="text-white/60 text-xs font-medium italic leading-relaxed">
                                 {activeQuestions[currentQuestion]?.explanation || "AI Explanation Unavailable."}
                              </p>
                           </motion.div>
                        )}

                       <div className="flex flex-wrap items-center justify-between pt-8 border-t border-white/5 gap-4">
                          <div className="flex gap-3">
                             <button onClick={prevQuestion} disabled={currentQuestion === 0} className={`px-8 py-3 rounded-xl border border-white/5 bg-white/5 font-black uppercase tracking-widest text-[9px] transition-all ${currentQuestion === 0 ? 'opacity-10' : 'hover:border-brand-primary/40 hover:bg-brand-primary/10'}`}>Back</button>

                          </div>

                           {currentQuestion < activeQuestions.length - 1 ? (
                              <button onClick={nextQuestion} className="px-10 py-3 rounded-xl border border-white/40 bg-brand-primary/10 font-black uppercase tracking-widest text-[9px] text-white hover:bg-white/20 transition-all">Next Step</button>
                           ) : (
                              <button onClick={finishBattle} className="px-12 py-3 rounded-xl border border-white bg-white text-black font-black uppercase tracking-widest text-[9px] shadow-[0_0_30px_rgba(255,255,255,0.3)]">Terminate</button>
                           )}
                       </div>
                    </div>
                 </GlassCard>
              </motion.div>
           </AnimatePresence>
        </div>
      </div>
    );
  }

  // 3. RESULTS VIEW (REDUCED)
  if (view === "results") {
    return (
      <div className="min-h-screen pt-32 pb-40 px-6 bg-black flex items-center justify-center relative">
        <div className="max-w-4xl w-full relative z-10 space-y-16 text-center">
           <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-7xl font-black uppercase tracking-tighter text-white leading-none">BATTLE <span className="neon-text">OVER</span></motion.h1>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{l:"Combat Points",v:score},{l:"Accuracy Rate",v:`${accuracy}%`},{l:"Efficiency",v:formatTime(timeLeft)}].map((res, i) => (
                 <GlassCard key={i} className="p-6 border-white/20 bg-black/40" glow>
                    <div className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-3">{res.l}</div>
                    <div className="text-5xl font-black text-white tracking-tighter">{res.v}</div>
                 </GlassCard>
              ))}
           </div>
           <button onClick={() => setView("evaluation")} className="px-12 py-6 bg-white/10 border border-white/20 backdrop-blur-xl text-white font-black uppercase tracking-[0.5em] text-[9px] rounded-[3rem] shadow-[0_0_60px_rgba(255,255,255,0.1)] hover:scale-105 transition-all flex items-center gap-4 mx-auto">Analyze Results <ChevronRight className="w-6 h-6" /></button>
        </div>
      </div>
    );
  }

  // 4. EVALUATION VIEW
  if (view === "evaluation") {
    const correctnessScore = accuracy;
    const clarityScore = accuracy === 0 ? 0 : Math.max(10, Math.round(accuracy * 0.85));
    const depthScore = accuracy === 0 ? 0 : Math.max(15, Math.round(accuracy * 0.95));

    return (
       <div className="min-h-screen pt-24 pb-32 px-6 bg-transparent relative overflow-hidden transition-all duration-1000 uppercase">
          <div className="absolute inset-0 z-0 text-brand-primary">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-brand-primary/10 blur-[200px] rounded-full animate-pulse opacity-20" />
             <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
          </div>

          <div className="max-w-6xl mx-auto space-y-16 relative z-10 text-center">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter text-white">AI <span className="text-brand-primary">SYNC</span> REPORT</h2>
                <p className="text-brand-primary/40 text-[10px] uppercase font-black tracking-[1.5em]">AI Deployment Evaluation Matrix</p>
             </motion.div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
                 <div className="lg:col-span-4 space-y-6">
                    {[{l:"Correctness",s:correctnessScore,i:CheckCircle2,c:"text-brand-primary"},{l:"Clarity",s:clarityScore,i:Brain,c:"text-cyan-400"},{l:"Depth",s:depthScore,i:Award,c:"text-amber-400"}].map((m, i) => (
                       <GlassCard key={i} className={`p-6 flex items-center gap-6 border-white/10 bg-white/5 transition-all hover:bg-white/10 overflow-hidden relative group`} glow>
                          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000`} />
                          <div className="relative w-20 h-20 shrink-0">
                             <svg className="w-full h-full -rotate-90 text-white/5"><circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="4" fill="transparent" /><motion.circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={213.6} initial={{ strokeDashoffset: 213.6 }} animate={{ strokeDashoffset: 213.6 - (213.6 * m.s) / 100 }} transition={{ duration: 3, delay: i * 0.4 }} className={m.c} strokeLinecap="round" /></svg>
                             <div className={`absolute inset-0 flex items-center justify-center text-xl font-black ${m.c}`}>{m.s}%</div>
                          </div>
                          <div className="space-y-1">
                             <h5 className={`text-[12px] font-black uppercase tracking-widest flex items-center gap-4 ${m.c}`}>
                                <div className={`w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md`}>
                                   <m.i className={`w-5 h-5 ${m.c}`} />
                                </div>
                                {m.l}
                             </h5>
                          </div>
                       </GlassCard>
                    ))}
                 </div>
                <div className="lg:col-span-8">
                   <GlassCard className="p-12 h-full border-white/20 bg-black/80 flex flex-col justify-between" glow>
                      <div className="space-y-12">
                         <div className="flex items-center gap-6 text-white border-b border-white/5 pb-8">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xl">
                               <Lightbulb className="w-8 h-8 text-brand-primary shadow-[0_0_20px_rgba(163,230,53,0.5)]" />
                            </div>
                            <h3 className="text-4xl font-black uppercase tracking-tighter">AI Synthesis</h3>
                         </div>
                         <p className="text-white/60 text-2xl font-medium italic animate-pulse">
                            "AI resonance with <span className="text-white font-black underline decoration-white/30 underline-offset-8">{subject}</span> {accuracy >= 80 ? "reveals an S-Tier logical trajectory. Proficiency in advanced patterns detected." : accuracy >= 50 ? "shows a solid operational baseline. Core concepts are stable, but deep-dive mechanics require further sync." : "indicates vital gaps in foundational architecture. Immediate recalibration is highly recommended."}"
                         </p>
                      </div><div className="mt-16"><Link to="/dashboard"><button className="w-full py-6 bg-brand-primary text-black font-black uppercase tracking-widest text-[9px] rounded-[3.5rem] shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all">Return to Matrix Dashboard</button></Link></div></GlassCard></div>
             </div>
          </div>
       </div>
    );
  }
  return null;
};

export default PracticeBattle;
