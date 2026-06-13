const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = express();
const PORT = 5001;
const SECRET_KEY = 'skillnova_neural_secret_2026';
const IS_VERCEL = process.env.VERCEL === '1';
const DB_PATH = IS_VERCEL ? path.join('/tmp', 'users.json') : path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

// Request logging for debugging on Vercel
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Support Root Verification
app.get('/', (req, res) => {
  res.json({ 
    status: "ONLINE",
    message: "SkillNova Backend Uplink Active.",
    endpoints: ["POST /api/register", "POST /api/login"],
    timestamp: new Date().toISOString()
  });
});

// API root health check (for /api requests on Vercel)
app.get('/api', (req, res) => {
  res.json({ 
    status: "ONLINE",
    message: "SkillNova API Active.",
    timestamp: new Date().toISOString()
  });
});

// Initialize dummy database if not exists
const initDB = async () => {
  if (!fs.existsSync(DB_PATH)) {
    // Seed with a demo user so login works immediately on Vercel
    const demoPassword = await bcrypt.hash('demo1234', 10);
    const seedUsers = [
      {
        id: 'demo_001',
        name: 'Demo User',
        email: 'demo@skillnova.com',
        password: demoPassword,
        college: 'Demo University',
        degree: 'B.Tech',
        year: '3rd',
        domain: 'Computer Science',
        stats: { matches: 0, battles: 0, readiness: 15 },
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(DB_PATH, JSON.stringify(seedUsers, null, 2));
    console.log('[DB] Initialized with demo user: demo@skillnova.com / demo1234');
  }
};
initDB().catch(err => console.error('[DB] Init error:', err));

// --- HELPER FUNCTIONS ---
const getUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch (err) {
    console.error('[DB] Read error, resetting:', err.message);
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
    return [];
  }
};
const saveUsers = (users) => fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));

// --- API ENDPOINTS ---

/**
 * Register Node
 */
app.post('/api/register', async (req, res) => {
  const { name, email, password, college, degree, year, domain } = req.body;
  const users = getUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "COMMUNICATION_LINK_EXISTING: Email already has an active uplink." });
  }

  // Hash password for real security
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

  // Generate Token
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '24h' });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword, token });
});

/**
 * Login Node
 */
app.post('/api/login', async (req, res) => {
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

  // Generate Token
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
});

// Change Password Endpoint
app.post('/api/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "PROFILE_NOT_FOUND: Subject ID rejected." });
  }

  // Verify old password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "INVALID_CREDENTIALS: Legacy access pattern rejected." });
  }

  // Hash and update
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const userIndex = users.findIndex(u => u.email === email);
  users[userIndex].password = hashedPassword;

  saveUsers(users);

  res.json({ message: "UPLINK_PATTERN_UPDATED: New access code established." });
});

// Mock Verification Store
const verificationCodes = new Map();

// Send Verification Code Endpoint
app.post('/api/send-verification', (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(email, code);
  
  console.log(`[AI_UPLINK] Verification code for ${email}: ${code}`);
  
  res.json({ message: "VERIFICATION_SENT: Check your uplink (Console Log) for the 6-digit access code." });
});

// Verify Old Password (Eager Check)
app.post('/api/verify-password', async (req, res) => {
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
});

// Update Profile (Name) Endpoint
app.post('/api/update-profile', (req, res) => {
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
});

// Reset Password (Forgot Password) Endpoint
app.post('/api/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  const storedCode = verificationCodes.get(email);
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === email);

  // 1. Verify Code (123456 demo masterkey)
  if (code !== "123456" && storedCode !== code) {
    return res.status(401).json({ message: "VERIFICATION_FAILURE: Invalid or expired access code." });
  }

  // 2. Clear code and update password
  verificationCodes.delete(email);
  if (userIndex !== -1) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;
    saveUsers(users);
    res.json({ message: "PATTERN_RESTORED: Your access code has been securely rewritten." });
  } else {
    res.status(404).json({ message: "PROFILE_NOT_FOUND: Subject ID rejected." });
  }
});

// Verify Code Endpoint
app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body;
  const storedCode = verificationCodes.get(email);
  
  // Accept the MASTERKEY (123456) for demo, OR the randomly generated code
  if (code === "123456" || (storedCode && storedCode === code)) {
    verificationCodes.delete(email); // One-time use
    res.json({ message: "UPLINK_VERIFIED: Subject authorized for pattern rewrite." });
  } else {
    res.status(401).json({ message: "VERIFICATION_FAILURE: Invalid or expired access code." });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
      console.log(`🚀 SkillNova Backend Uplink Active on http://localhost:${PORT}`);
  });
}

module.exports = app;
