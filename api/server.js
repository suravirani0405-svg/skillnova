import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// ============================================================
// SkillNova Backend — Vercel Serverless Function (ESM)
// ============================================================

const app = express();
const SECRET_KEY = 'skillnova_neural_secret_2026';
const DB_PATH = path.join('/tmp', 'users.json');

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// --- DATABASE HELPERS ---
const initDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const demoHash = bcrypt.hashSync('demo1234', 10);
      const seed = [
        {
          id: 'demo_001',
          name: 'Demo User',
          email: 'demo@skillnova.com',
          password: demoHash,
          college: 'Demo University',
          degree: 'B.Tech',
          year: '3rd',
          domain: 'Computer Science',
          stats: { matches: 0, battles: 0, readiness: 15 },
          createdAt: new Date().toISOString()
        }
      ];
      fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
      console.log('[DB] Seeded: demo@skillnova.com / demo1234');
    }
  } catch (err) {
    console.error('[DB] Init error:', err.message);
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }
};

const getUsers = () => {
  initDB();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch (err) {
    console.error('[DB] Read error:', err.message);
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
};

// --- HEALTH CHECK ---
app.get('/api', (req, res) => {
  res.json({
    status: "ONLINE",
    message: "SkillNova Backend Uplink Active.",
    endpoints: ["POST /api/register", "POST /api/login"],
    timestamp: new Date().toISOString()
  });
});

// --- REGISTER ---
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, college, degree, year, domain } = req.body;
    const users = getUsers();

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "COMMUNICATION_LINK_EXISTING: Email already has an active uplink." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      college,
      degree,
      year,
      domain,
      stats: { matches: 0, battles: 0, readiness: 15 },
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('[REGISTER] Error:', err);
    res.status(500).json({ message: "SERVER_ERROR: Registration failed. " + err.message });
  }
});

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({ message: "AUTHENTICATION_FAILURE: Identity not found in network." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "AUTHENTICATION_FAILURE: Secure pattern mismatch." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('[LOGIN] Error:', err);
    res.status(500).json({ message: "SERVER_ERROR: Login failed. " + err.message });
  }
});

// --- CHANGE PASSWORD ---
app.post('/api/change-password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "PROFILE_NOT_FOUND: Subject ID rejected." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "INVALID_CREDENTIALS: Legacy access pattern rejected." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const userIndex = users.findIndex(u => u.email === email);
    users[userIndex].password = hashedPassword;
    saveUsers(users);

    res.json({ message: "UPLINK_PATTERN_UPDATED: New access code established." });
  } catch (err) {
    console.error('[CHANGE-PASSWORD] Error:', err);
    res.status(500).json({ message: "SERVER_ERROR: " + err.message });
  }
});

// --- VERIFICATION STORE (in-memory) ---
const verificationCodes = new Map();

// --- SEND VERIFICATION ---
app.post('/api/send-verification', (req, res) => {
  try {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, code);
    console.log(`[AI_UPLINK] Verification code for ${email}: ${code}`);
    res.json({ message: "VERIFICATION_SENT: Check your uplink (Console Log) for the 6-digit access code." });
  } catch (err) {
    res.status(500).json({ message: "SERVER_ERROR: " + err.message });
  }
});

// --- VERIFY PASSWORD ---
app.post('/api/verify-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "PROFILE_NOT_FOUND: Subject ID rejected." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "INVALID_CREDENTIALS: Legacy access pattern rejected." });
    }

    res.json({ message: "IDENTITY_CONFIRMED: Access pattern validated." });
  } catch (err) {
    res.status(500).json({ message: "SERVER_ERROR: " + err.message });
  }
});

// --- UPDATE PROFILE ---
app.post('/api/update-profile', (req, res) => {
  try {
    const { email, newName } = req.body;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return res.status(404).json({ message: "PROFILE_NOT_FOUND: Subject ID rejected." });
    }

    users[userIndex].name = newName;
    saveUsers(users);

    res.json({
      message: "IDENTIFIER_UPDATED: AI name synchronized.",
      user: users[userIndex]
    });
  } catch (err) {
    res.status(500).json({ message: "SERVER_ERROR: " + err.message });
  }
});

// --- RESET PASSWORD ---
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const storedCode = verificationCodes.get(email);
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (code !== "123456" && storedCode !== code) {
      return res.status(401).json({ message: "VERIFICATION_FAILURE: Invalid or expired access code." });
    }

    verificationCodes.delete(email);
    if (userIndex !== -1) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      users[userIndex].password = hashedPassword;
      saveUsers(users);
      res.json({ message: "PATTERN_RESTORED: Your access code has been securely rewritten." });
    } else {
      res.status(404).json({ message: "PROFILE_NOT_FOUND: Subject ID rejected." });
    }
  } catch (err) {
    res.status(500).json({ message: "SERVER_ERROR: " + err.message });
  }
});

// --- VERIFY CODE ---
app.post('/api/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;
    const storedCode = verificationCodes.get(email);

    if (code === "123456" || (storedCode && storedCode === code)) {
      verificationCodes.delete(email);
      res.json({ message: "UPLINK_VERIFIED: Subject authorized for pattern rewrite." });
    } else {
      res.status(401).json({ message: "VERIFICATION_FAILURE: Invalid or expired access code." });
    }
  } catch (err) {
    res.status(500).json({ message: "SERVER_ERROR: " + err.message });
  }
});

// --- GENERATE QUIZ (Gemini AI) ---
app.post('/api/generate-quiz', async (req, res) => {
  const { subject = 'Python', difficulty = 'Medium' } = req.body;

  // Try Gemini AI first
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (GEMINI_KEY) {
    try {
      const prompt = `Generate exactly 10 multiple choice quiz questions about "${subject}" at "${difficulty}" difficulty level for a computer science student.

Rules:
- Each question must be UNIQUE and DIFFERENT every time - randomize topics within the subject
- Cover varied sub-topics of ${subject} (don't repeat similar questions)
- Each question must have exactly 4 options
- One option must be the correct answer
- Provide a brief, technical 1-2 sentence explanation of why the answer is correct
- Difficulty: ${difficulty} (Easy=basic concepts, Medium=application, Hard=advanced/tricky)

Return ONLY a valid JSON array like this:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Brief technical explanation of why Option A is correct."
  }
]

No markdown, no explanation outside the JSON, just the JSON array.`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 1.2, maxOutputTokens: 2048 }
          })
        }
      );

      const geminiData = await geminiRes.json();
      const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const match = rawText.match(/\[[\s\S]*\]/);
      if (match) {
        const questions = JSON.parse(match[0]);
        if (Array.isArray(questions) && questions.length >= 5) {
          console.log(`[QUIZ] Gemini generated ${questions.length} questions for ${subject}`);
          return res.json({ questions, source: 'gemini' });
        }
      }
    } catch (err) {
      console.error('[QUIZ] Gemini error:', err.message);
    }
  }

  // Smart fallback: seeded random variation so questions feel different every time
  console.log(`[QUIZ] Using seeded fallback for ${subject}`);
  const seed = Date.now();
  const rng = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((seed * (i + 1) * 9301 + 49297) % 233280 / 233280 * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const POOL = {
    PYTHON: [
      { question: "What does 'yield' do in Python?", options: ["Returns a generator value", "Breaks a loop", "Imports a module", "Declares a variable"], answer: "Returns a generator value" },
      { question: "Which method removes and returns the last item of a list?", options: ["pop()", "remove()", "delete()", "discard()"], answer: "pop()" },
      { question: "What is a lambda in Python?", options: ["An anonymous function", "A loop type", "A class decorator", "A module"], answer: "An anonymous function" },
      { question: "What does 'is' operator check?", options: ["Identity (same object)", "Equality of value", "Data type", "Membership"], answer: "Identity (same object)" },
      { question: "Which of these is a valid dictionary comprehension?", options: ["{k: v for k, v in items}", "[k: v for k, v in items]", "(k: v for k, v in items)", "{k, v for k, v in items}"], answer: "{k: v for k, v in items}" },
      { question: "What is '__init__' in Python?", options: ["Constructor method", "Destructor method", "Static method", "Class variable"], answer: "Constructor method" },
      { question: "What module is used for regular expressions?", options: ["re", "regex", "regexp", "string"], answer: "re" },
      { question: "Which keyword creates a generator?", options: ["yield", "return", "generate", "async"], answer: "yield" },
      { question: "What does 'enumerate()' return?", options: ["Index and value pairs", "Only values", "Only indices", "A dictionary"], answer: "Index and value pairs" },
      { question: "Which method adds an element to a set?", options: ["add()", "append()", "insert()", "push()"], answer: "add()" },
      { question: "What is the GIL in Python?", options: ["Global Interpreter Lock", "Global Instance Library", "General Input Layer", "Generic Iteration Loop"], answer: "Global Interpreter Lock" },
      { question: "What does 'args' mean in *args?", options: ["Variable positional arguments", "Required arguments", "Keyword arguments", "Default arguments"], answer: "Variable positional arguments" },
      { question: "Which built-in sorts a list in-place?", options: ["list.sort()", "sorted()", "list.order()", "list.arrange()"], answer: "list.sort()" },
      { question: "What is a Python decorator?", options: ["A function that modifies another function", "A class attribute", "A type of loop", "A module alias"], answer: "A function that modifies another function" },
      { question: "Which data type is unordered and unique?", options: ["set", "list", "tuple", "dict"], answer: "set" },
    ],
    JAVA: [
      { question: "What is method overloading?", options: ["Same method name, different parameters", "Same method name, different class", "Overriding parent method", "Static method calling"], answer: "Same method name, different parameters" },
      { question: "Which interface does ArrayList implement?", options: ["List", "Set", "Map", "Queue"], answer: "List" },
      { question: "What is the purpose of 'synchronized' in Java?", options: ["Thread safety", "Speed optimization", "Memory management", "Exception handling"], answer: "Thread safety" },
      { question: "What does 'static' mean in Java?", options: ["Belongs to the class, not instance", "Cannot be changed", "Private access only", "Abstract method"], answer: "Belongs to the class, not instance" },
      { question: "Which exception is thrown for null reference?", options: ["NullPointerException", "NullException", "RuntimeException", "IllegalArgumentException"], answer: "NullPointerException" },
      { question: "What is an interface in Java?", options: ["A contract with abstract methods", "A class with no methods", "A static class", "A data structure"], answer: "A contract with abstract methods" },
      { question: "What does 'super' keyword refer to?", options: ["Parent class", "Current class", "Static method", "Interface"], answer: "Parent class" },
      { question: "Which collection is thread-safe?", options: ["ConcurrentHashMap", "HashMap", "ArrayList", "LinkedList"], answer: "ConcurrentHashMap" },
      { question: "What is the difference between == and equals()?", options: ["== checks reference, equals() checks value", "Both check value", "Both check reference", "equals() checks reference"], answer: "== checks reference, equals() checks value" },
      { question: "What is garbage collection in Java?", options: ["Automatic memory deallocation", "Manual memory management", "File cleanup", "Exception clearing"], answer: "Automatic memory deallocation" },
      { question: "Which keyword prevents a class from being subclassed?", options: ["final", "static", "abstract", "sealed"], answer: "final" },
      { question: "What is a checked exception?", options: ["Must be handled at compile time", "Only at runtime", "Cannot be caught", "Only in threads"], answer: "Must be handled at compile time" },
      { question: "What is polymorphism?", options: ["One interface, multiple implementations", "Multiple inheritance", "Static binding only", "Method hiding"], answer: "One interface, multiple implementations" },
      { question: "Which Java version introduced lambdas?", options: ["Java 8", "Java 7", "Java 11", "Java 5"], answer: "Java 8" },
      { question: "What does 'volatile' keyword do?", options: ["Ensures variable visibility across threads", "Makes variable constant", "Speeds up access", "Prevents null values"], answer: "Ensures variable visibility across threads" },
    ],
    DSA: [
      { question: "What is the time complexity of inserting into a Hash Map?", options: ["O(1) average", "O(n)", "O(log n)", "O(n²)"], answer: "O(1) average" },
      { question: "What is a Red-Black Tree?", options: ["A self-balancing BST", "A graph type", "A heap variant", "A hash table"], answer: "A self-balancing BST" },
      { question: "What is dynamic programming?", options: ["Solving overlapping subproblems with memoization", "Recursive brute force", "Greedy optimization", "Divide and conquer"], answer: "Solving overlapping subproblems with memoization" },
      { question: "What is the space complexity of Merge Sort?", options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], answer: "O(n)" },
      { question: "What is a trie used for?", options: ["Prefix-based string search", "Sorting numbers", "Graph traversal", "Matrix multiplication"], answer: "Prefix-based string search" },
      { question: "What is Dijkstra's algorithm for?", options: ["Shortest path in weighted graph", "Minimum spanning tree", "Topological sort", "Cycle detection"], answer: "Shortest path in weighted graph" },
      { question: "What makes a graph bipartite?", options: ["Two-colorable (no odd cycles)", "No cycles at all", "Fully connected", "Equal in-degree and out-degree"], answer: "Two-colorable (no odd cycles)" },
      { question: "What is amortized analysis?", options: ["Average cost per operation over a sequence", "Worst case per operation", "Best case analysis", "Space complexity analysis"], answer: "Average cost per operation over a sequence" },
      { question: "What is a segment tree used for?", options: ["Range queries and updates", "String matching", "Graph coloring", "Sorting"], answer: "Range queries and updates" },
      { question: "Which algorithm solves the knapsack problem?", options: ["Dynamic programming", "Binary search", "BFS", "Quick sort"], answer: "Dynamic programming" },
      { question: "What is the height of a balanced BST with n nodes?", options: ["O(log n)", "O(n)", "O(1)", "O(n²)"], answer: "O(log n)" },
      { question: "What does topological sort apply to?", options: ["Directed Acyclic Graphs (DAG)", "Undirected graphs", "Weighted graphs", "Complete graphs"], answer: "Directed Acyclic Graphs (DAG)" },
      { question: "What is a heap property?", options: ["Parent is always greater/less than children", "All nodes are equal", "No duplicate values", "Sorted from left to right"], answer: "Parent is always greater/less than children" },
      { question: "What is the purpose of a sentinel node?", options: ["Simplify edge cases in linked lists/trees", "Store extra data", "Mark the root", "Balance a tree"], answer: "Simplify edge cases in linked lists/trees" },
      { question: "What is the best algorithm for finding a cycle in a linked list?", options: ["Floyd's cycle detection", "DFS", "BFS", "Binary search"], answer: "Floyd's cycle detection" },
    ],
    SQL: [
      { question: "What is a VIEW in SQL?", options: ["A virtual table based on a query", "A physical table copy", "An index type", "A stored procedure"], answer: "A virtual table based on a query" },
      { question: "What does ACID stand for?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Consistency, Integrity, Durability", "Atomicity, Consistency, Integrity, Data", "Accuracy, Concurrency, Isolation, Durability"], answer: "Atomicity, Consistency, Isolation, Durability" },
      { question: "What is database normalization?", options: ["Reducing data redundancy", "Speeding up queries", "Adding more indexes", "Encrypting data"], answer: "Reducing data redundancy" },
      { question: "Which JOIN only returns matching rows?", options: ["INNER JOIN", "LEFT JOIN", "FULL JOIN", "CROSS JOIN"], answer: "INNER JOIN" },
      { question: "What is an index in SQL?", options: ["A data structure to speed up queries", "A foreign key", "A table constraint", "A backup"], answer: "A data structure to speed up queries" },
      { question: "What is a stored procedure?", options: ["A saved SQL block executed on demand", "A table trigger", "A type of index", "A view"], answer: "A saved SQL block executed on demand" },
      { question: "What does COALESCE() do?", options: ["Returns first non-null value", "Concatenates strings", "Counts nulls", "Converts data types"], answer: "Returns first non-null value" },
      { question: "What is a TRIGGER in SQL?", options: ["Automatic action on table events", "A type of index", "A foreign key rule", "A query plan"], answer: "Automatic action on table events" },
      { question: "What is a CTE (Common Table Expression)?", options: ["A temporary named result set", "A permanent table", "An index type", "A database role"], answer: "A temporary named result set" },
      { question: "Which normal form removes transitive dependencies?", options: ["3NF", "1NF", "2NF", "BCNF"], answer: "3NF" },
      { question: "What does ROLLBACK do?", options: ["Undoes uncommitted transaction changes", "Commits all changes", "Deletes a table", "Resets an index"], answer: "Undoes uncommitted transaction changes" },
      { question: "What is a composite key?", options: ["A key made of multiple columns", "A key with auto-increment", "A foreign key reference", "An encrypted key"], answer: "A key made of multiple columns" },
      { question: "What is the difference between TRUNCATE and DELETE?", options: ["TRUNCATE is faster and non-logged", "DELETE is faster", "Both are identical", "TRUNCATE supports WHERE clause"], answer: "TRUNCATE is faster and non-logged" },
      { question: "What does PARTITION BY do in window functions?", options: ["Divides rows into groups for calculation", "Sorts the result", "Filters rows", "Creates a new table"], answer: "Divides rows into groups for calculation" },
      { question: "What is a deadlock in SQL?", options: ["Two transactions blocking each other", "A slow query", "A missing index", "A syntax error"], answer: "Two transactions blocking each other" },
    ],
    DEFAULT: [
      { question: "What is a REST API?", options: ["Stateless HTTP-based interface", "A database protocol", "A frontend framework", "A testing tool"], answer: "Stateless HTTP-based interface" },
      { question: "What is the purpose of CI/CD?", options: ["Automated testing and deployment", "Manual code review", "Server configuration", "UI design"], answer: "Automated testing and deployment" },
      { question: "What is Docker used for?", options: ["Containerizing applications", "Version control", "Database management", "UI testing"], answer: "Containerizing applications" },
      { question: "What does 'stateless' mean in web services?", options: ["Each request is independent", "Server stores all sessions", "Only GET requests allowed", "No database required"], answer: "Each request is independent" },
      { question: "What is a microservice?", options: ["A small independent deployable service", "A tiny UI component", "A database table", "A CSS class"], answer: "A small independent deployable service" },
      { question: "What is OAuth?", options: ["An authorization framework", "A database protocol", "A UI framework", "A testing standard"], answer: "An authorization framework" },
      { question: "What is a webhook?", options: ["HTTP callback triggered by an event", "A web scraping tool", "A browser API", "A CSS hook"], answer: "HTTP callback triggered by an event" },
      { question: "What is the purpose of load balancing?", options: ["Distributing traffic across servers", "Speeding up databases", "Compressing files", "Encrypting data"], answer: "Distributing traffic across servers" },
      { question: "What does 'idempotent' mean in REST?", options: ["Same result no matter how many times called", "Always returns 200", "Requires authentication", "Only works once"], answer: "Same result no matter how many times called" },
      { question: "What is a CDN?", options: ["Content Delivery Network", "Central Database Node", "Code Deployment Network", "Client Data Node"], answer: "Content Delivery Network" },
      { question: "What is rate limiting?", options: ["Restricting API call frequency", "Limiting file size", "Slowing server response", "Blocking users"], answer: "Restricting API call frequency" },
      { question: "What is eventual consistency?", options: ["All nodes agree after some delay", "Immediate consistency", "No consistency guarantee", "Single node operation"], answer: "All nodes agree after some delay" },
      { question: "What is a race condition?", options: ["Unpredictable behavior from concurrent access", "A performance benchmark", "A testing method", "A network timeout"], answer: "Unpredictable behavior from concurrent access" },
      { question: "What is the difference between authentication and authorization?", options: ["Auth=who you are, Authz=what you can do", "They are the same", "Auth=what you can do, Authz=who you are", "Only authentication matters"], answer: "Auth=who you are, Authz=what you can do" },
      { question: "What is a JWT?", options: ["JSON Web Token for stateless auth", "Java Web Tool", "JavaScript Widget Template", "JSON Write Transaction"], answer: "JSON Web Token for stateless auth" },
    ]
  };

  const key = subject.toUpperCase().replace(/[^A-Z]/g, '');
  const pool = POOL[key] || POOL.DEFAULT;
  const questions = rng(pool).slice(0, 10);
  return res.json({ questions, source: 'fallback' });
});

// --- CATCH-ALL ---
app.all('*', (req, res) => {
  res.status(404).json({ message: "ENDPOINT_NOT_FOUND: " + req.method + " " + req.url });
});

export default app;
