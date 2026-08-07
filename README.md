# 🚀 ML Visual Lab

> **Inside the Algorithm — An Interactive Visual Playground for Understanding Machine Learning**

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)
![NodeJS](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

### 🎯 Hackathon Project • Education Domain • SDG 4 – Quality Education

**Learn → Visualize → Experiment → Practice**

</div>

---

## 📖 Table of Contents

- [Introduction](#-introduction)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Product Workflow](#-product-workflow)
- [Core Modules](#️-core-modules)
- [Supported Algorithms](#-supported-algorithms)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Future Roadmap](#-future-roadmap)
- [SDG Alignment](#-sdg-alignment)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 📌 Introduction

Machine Learning has become one of the most important skills in today's technology landscape.

Despite thousands of online courses, most students still struggle to understand **how Machine Learning algorithms actually work**.

Students often memorize mathematical formulas without developing an intuitive understanding of concepts such as:

- Gradient Descent
- Decision Boundaries
- Neural Network Learning
- Overfitting
- Logistic Regression
- PCA
- Clustering

Most educational platforms rely heavily on videos, static diagrams, or code notebooks. As a result, learners know **what an algorithm does**, but rarely understand **how it learns**.

**ML Visual Lab** addresses this challenge by transforming abstract Machine Learning concepts into **interactive visual experiences** that run directly in the browser — no installation or coding required.

---

## ❗ Problem Statement

**FILE-02 • PS-02 • Education Domain**

> **Inside the Algorithm — A Visual Playground for Understanding Machine Learning**

**Relevant SDG:** SDG 4 – Quality Education

### Challenges

- Machine Learning concepts are taught using equations instead of visual intuition.
- Students struggle to understand model learning behavior.
- Setting up Python environments is a barrier for beginners.
- Existing tools rarely provide real-time visual feedback.
- Most educational resources are passive rather than interactive.

---

## 💡 Our Solution

ML Visual Lab is a browser-based educational platform that allows learners to **see Machine Learning algorithms learn in real time**.

The platform combines:

- Guided theory (**ML Coach**)
- Interactive algorithm visualizations (**Playground**)
- Practical assessments (**Practice**)

This creates a complete educational journey:

```
Read → Visualize → Experiment → Practice → Master
```

Unlike traditional learning platforms, ML Visual Lab focuses on **building intuition before implementation**.

---

## ✨ Key Features

### 📚 ML Coach
A structured learning module where users:
- Learn theory step by step
- Read dedicated lessons
- Navigate slide-by-slide
- Track completed modules
- Build conceptual understanding before experimentation

### 🎮 Interactive Playground
Users can interact with Machine Learning algorithms in real time by changing parameters such as:
- Learning Rate
- Epochs
- Number of Clusters
- Tree Depth
- Regularization
- Decision Thresholds

Every parameter change immediately updates:
- Decision Boundaries
- Loss Curves
- Data Points
- Model Predictions
- Weight Updates

### 🧠 Practice Module
Reinforces learning with quizzes covering Linear Regression, Logistic Regression, Gradient Descent, Decision Trees, K-Means, PCA, Neural Networks, and Overfitting.

Each quiz provides:
- Immediate feedback
- Correct explanations
- Topic-wise performance
- Progress tracking

### 📊 Real-Time Visualizations
Powered by Three.js, React Three Fiber, and Recharts:
- 3D Scatter Plots
- Decision Boundaries
- Gradient Descent Animation
- PCA Projection
- Clustering Visualization
- Loss Curves
- Training Progress

### 🎨 Premium UI/UX
Modern SaaS-inspired design featuring:
- Glassmorphism
- Dark Theme
- GSAP Animations
- Framer Motion
- Responsive Layout
- Interactive Cards
- Smooth Page Transitions

---

## 🎯 Product Workflow

```
User Opens ML Visual Lab
        │
        ▼
     Dashboard
        │
        ▼
     ML Coach
        │
        ▼
Learn Theory Module
        │
        ▼
  Complete Lesson
        │
        ▼
Interactive Playground
        │
        ▼
 Visualize Algorithm
        │
        ▼
   Practice Quiz
        │
        ▼
  Track Progress
```

---

## 🏗️ Core Modules

### 📘 ML Coach
The educational foundation of the platform. Users progress through structured learning modules before entering the Playground.

Features include: Lesson Cards, Reading Interface, Slide Navigation, Progress Tracking, Completed Module Indicators.

### 🧪 Playground
Interactive experimentation environment where users manipulate Machine Learning models and observe learning behavior in real time.

**Available Labs:**
- Linear Regression Lab
- Logistic Regression Lab
- Gradient Descent Lab
- Neural Network Lab
- Overfitting Lab
- Decision Tree Lab
- K-Means Lab
- PCA Lab

### 📝 Practice
Interactive quiz engine with Multiple Choice Questions, Topic Selection, Difficulty Levels, Progress Tracking, Results Dashboard, and Learning Recommendations.

---

## 🤖 Supported Algorithms

- Linear Regression
- Logistic Regression
- Gradient Descent
- Neural Networks
- Decision Trees
- K-Means Clustering
- Principal Component Analysis (PCA)
- Overfitting & Regularization

---

## 🌟 Why ML Visual Lab?

**Traditional Learning:**
```
Read Theory → Write Code → Hope It Works → Understand Later
```

**ML Visual Lab:**
```
Learn Theory → See It Happen → Interact → Experiment → Understand → Practice → Master
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript 5, Vite 7 |
| **Styling** | TailwindCSS 3, Framer Motion, GSAP |
| **3D / Visualization** | Three.js, React Three Fiber, Recharts |
| **Backend** | Node.js, Express |
| **Database** | MongoDB |
| **Deployment** | Vercel / Render / Netlify (choose per environment) |

---

## 🏛️ Architecture

```
┌────────────────────┐        ┌────────────────────┐        ┌────────────────────┐
│   React Frontend    │ <----> │   Express Backend   │ <----> │      MongoDB        │
│  (Vite + TS + R3F)  │  REST  │   (Node.js API)     │        │   (User & Progress   │
│                      │  API   │                      │        │      Data)          │
└────────────────────┘        └────────────────────┘        └────────────────────┘
        │
        ▼
┌────────────────────┐
│  Visualization Layer │
│  (Three.js, Recharts)│
└────────────────────┘
```

- The **frontend** renders all interactive Playground labs client-side for real-time responsiveness.
- The **backend** handles authentication, lesson content, quiz data, and progress tracking.
- **MongoDB** persists user profiles, completed lessons, and quiz results.

---

## 📁 Folder Structure

```
ml-visual-lab/
├── client/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/              # Dashboard, Coach, Playground, Practice
│   │   ├── labs/                # Individual algorithm lab implementations
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                  # Utilities and helpers
│   │   └── assets/               # Images, icons, fonts
│   ├── public/
│   └── vite.config.ts
├── server/                    # Node.js + Express backend
│   ├── routes/                 # API route definitions
│   ├── controllers/            # Request handlers
│   ├── models/                  # MongoDB schemas
│   ├── middleware/              # Auth, error handling
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance (local or Atlas)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/ml-visual-lab.git
cd ml-visual-lab

# 2. Install frontend dependencies
cd client
npm install

# 3. Install backend dependencies
cd ../server
npm install

# 4. Configure environment variables (see below)
cp .env.example .env

# 5. Start the backend
npm run dev

# 6. In a new terminal, start the frontend
cd ../client
npm run dev
```

---

## ▶️ Usage

1. Open the app in your browser at `http://localhost:5173`
2. Navigate to **ML Coach** to learn the theory behind an algorithm
3. Move to **Playground** to interact with live parameters and visualizations
4. Test your understanding in **Practice** with topic-wise quizzes
5. Track your progress from the **Dashboard**

---

## 🔐 Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate a user |
| `GET` | `/api/lessons` | Fetch all ML Coach lessons |
| `GET` | `/api/lessons/:id` | Fetch a single lesson |
| `POST` | `/api/progress` | Update a user's learning progress |
| `GET` | `/api/quiz/:topic` | Fetch quiz questions for a topic |
| `POST` | `/api/quiz/submit` | Submit quiz answers and get results |

---

## 📸 Screenshots

> _Add screenshots or GIFs of the Dashboard, ML Coach, Playground, and Practice modules here._

```
[Dashboard]   [ML Coach]   [Playground]   [Practice]
```

---

## 🗺️ Future Roadmap

- [ ] Add support for CNNs and RNNs visual labs
- [ ] Add collaborative multiplayer learning rooms
- [ ] Export trained model weights and visual reports
- [ ] Mobile-responsive Playground labs
- [ ] Gamification: badges, streaks, and leaderboards
- [ ] Multi-language support

---

## 🎓 Educational Impact & SDG Alignment

ML Visual Lab directly supports **SDG 4 – Quality Education** by making Machine Learning concepts visual, interactive, and accessible to:

- University Students
- Engineering Colleges
- AI Beginners
- Self-Learners
- Bootcamps
- Educators
- Coding Clubs
- Hackathons

By making Machine Learning concepts visual, interactive, and accessible, the platform helps learners build intuition instead of relying solely on memorization.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 👥 Team

| Name | Role | GitHub |
|---|---|---|
| _Samyak Mahatme_ | _Team - leader_ | 
| _Lavanya Vaidya_  | Member
| _Ashutosh Nanoti_ | Member
| _Raunak Pantawne_ |  Member

---

<div align="center">

**Built with ❤️ for [Smackathon'26] — Empowering learners to understand Machine Learning, one visualization at a time.**


</div>
