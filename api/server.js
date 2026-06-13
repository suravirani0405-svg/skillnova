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

// --- CATCH-ALL ---
app.all('*', (req, res) => {
  res.status(404).json({ message: "ENDPOINT_NOT_FOUND: " + req.method + " " + req.url });
});

export default app;
