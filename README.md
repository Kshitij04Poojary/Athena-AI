# ⚡ AthenaAI - Your Personalized AI-Powered Learning Companion

AthenaAI is an intelligent, all-in-one learning platform designed to revolutionize the way students learn, build, and grow in the tech space. It combines cutting-edge AI features with personalized learning paths, real-time project ideas, assessments, and internships — all tailored to the user's skill level and goals.

---

## 🚀 Features

### 🧠 AI Course Content Generator
- Automatically generates structured course content aligned with industry standards.
- Embeds videos, documents, and resources.
- Issues **certificates only after rigorous final assessments**.

### 🎤 AI Mock Interviews
- Generates **role-specific interview questions**.
- Uses **speech-to-text** and **webcam analysis** for **real-time feedback**.

### 💡 AI Project Guide
- Scrapes GitHub in real-time based on user’s skills.
- Uses **LLM (Mistral Saba)** to analyze repositories.
- Provides **project descriptions, innovative ideas, and inspiration**.

### 🎯 Internship Dashboard
- Built using **Selenium**.
- Scrapes internship listings from multiple platforms in real-time.
- Filters opportunities by **skills, location, stipend, and work mode**.

### 🧪 AI-Powered Assessments
- Practice topic-specific, **AI-generated quizzes**.
- Smart question selection to improve weak areas.

### 🧑‍💻 Code Editor
- Fully-integrated for **hands-on coding practice** inside the platform.

### 🤖 AI Chatbot
- Built with **LLaMA**, responds to both **text and voice inputs**.
- Helps with **instant doubt resolution**.

### 🕹️ Gamification
- Users can generate games/learning paths for any skill.
- Compete and **track progress on a global leaderboard**.

### 📚 Chat with PDF
- Upload any PDF and interact with it using **LangChain + FAISS + Gemini AI Embeddings**.
- Get context-aware answers and summaries.

### 📊 Student Dashboard
- Track **course progress**, **assessment scores**, **recommended paths**, and **study schedule** — all in one place.

---

## 🧩 Project Structure

AthenaAI/ ├── backend/ │ ├── node/ # AI services like interviews, scraping, etc. │ └── flask/ # PDF chat, vector DB, assessments ├── frontend/ # React-based UI ├── README.md

---

## ⚙️ Getting Started

### 🔧 Prerequisites
- **Node.js & npm**
- **Python 3.8+**
- **Virtualenv** (for Python)
- **Selenium requirements** (for scraping internship portals)

---

### 📦 Backend Setup

#### ▶ Node Backend (for AI services)
cd backend/node
npm install
npm run dev

🐍 Flask Backend (for PDF chat, vector DB, etc.)
cd backend/flask
python -m venv venv
# Activate the virtual environment:

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python run.py


💻 Frontend Setup (React)
cd frontend
npm install
npm run dev


🌐 Technologies Used
React.js (Frontend)

Node.js + Express.js

Python Flask

LLMs: LLaMA, Mistral Saba, Gemini Embeddings

LangChain, FAISS

Selenium

Speech-to-Text APIs

OpenCV / Webcam APIs

CodeMirror (for embedded code editor)


---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository.
2. **Create a new branch**  
   git checkout -b feature-branch
3. **Make your changes and commit**  
   git commit -m "Added new feature"
4. **Push to the branch**  
   git push origin feature-branch
5. **Open a Pull Request**

Let’s build the future of AI-powered learning together! 🚀

---

## 🌟 Show Your Support

If you like this project, please consider ⭐ starring the repo and sharing it with your friends!

