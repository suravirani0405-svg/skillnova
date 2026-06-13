# SkillNova – AI-Driven Personalized Learning & Skill Gap Analyzer

<p align="center">
  <img src="public/neural_twin_base.png" width="200" alt="SkillNova Logo">
</p>

<p align="center">
  <a href="https://skillnova-three.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel" alt="Vercel Live Demo">
  </a>
</p>

### ⚛️ Project Overview
SkillNova is a futuristic, AI-native career development platform designed to bridge the chasm between academic learning and industry readiness. Powered by **Google Gemini 2.0 Flash**, it analyzes resumes, detects technical skill gaps, and generates dynamic, personalized learning roadmaps for every individual.

---

### 🚀 Core Architecture

| **Node** | **Infrastructure** | **Logical Mission** |
| :--- | :--- | :--- |
| **Skill UI** | Vite + React | High-performance, glassmorphic interface with real-time AI sync. |
| **Neural API** | Node.js Serverless | Edge-ready backend handling Gemini-driven AI Quiz generation and secure auth. |
| **Analysis Node**| FastAPI (Python) | The deep-processing brain — handles heavy PDF resume parsing and lexicon analysis. |

---

### 🌟 Key Intelligence Features
1. **🧠 Deep AI Analysis**: Parses raw PDF resumes and academic transcripts to detect hidden technical potential.
2. **🗺️ AI Sync Roadmap**: A dynamically generated phase-by-phase learning path with prioritized resources.
3. **⚔️ Combat Arena (Practice Battle)**: An AI-driven quiz engine using Gemini to generate unique, unrepeatable technical questions on the fly, complete with instant "Technical Briefing" AI explanations.
4. **🤖 Nova AI Chatbot**: A 24/7 technical mentor trained on user-specific skill gaps and career trajectories.
5. **🧬 Neural Twin Visualizer**: A living visual representation of the user’s professional DNA.

#### 🚀 Next-Gen Additions
* **📡 Neural Broadcast (Video Integration):** Seamlessly embeds top-tier, curated technical video lectures directly into your AI Sync Roadmap.
* **🎯 Node-Specific Combat Tests:** After watching a Neural Broadcast, you must defeat a targeted Combat Test generated specifically about that video's content before progressing.
* **📈 Skill-Tree Progression System:** Treats learning like an RPG, unlocking new nodes and tech branches based on your Combat Arena victories.

---

### ⚙️ Quick Development Start

1. **Clone the Uplink:**
   ```bash
   git clone https://github.com/suravirani0405-svg/skillnova.git
   cd skillnova
   ```

2. **Install Core Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Synchronization:**
   Create a `.env` file in the **root directory** and inject your secure API key for the Node.js + Gemini engine:
   ```env
   GEMINI_API_KEY=your_gemini_key_here
   ```
   *(If running the heavy Python analysis node locally, mirror this key inside `ai_backend/.env` as well).*

4. **Initialize Ecosystem:**
   Run the master orchestrator to launch the frontend UI and backends simultaneously:
   ```bash
   python skillnova_all_in_one.py
   ```

---

### 🔐 Security & Identity
SkillNova utilizes a multi-layered security protocol to ensure your identity and career blueprint remain private. All API calls to the Neural Node are encrypted and ephemeral.

---

#### © 2026 SkillNova AI. Reimagining career evolution.
