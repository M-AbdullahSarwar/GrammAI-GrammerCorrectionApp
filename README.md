# 📘 GrammAI – Grammar Correction Mobile App

GrammAI is a full-stack mobile application that helps users detect and correct grammar and spelling errors using OpenAI’s GPT model. It features secure authentication (JWT), real-time grammar correction, and a clean mobile interface built with React Native.

---

## 🚀 Features

- ✍️ Grammar and spelling correction via OpenAI GPT-3.5
- 🔒 Secure user authentication using JWT
- 📱 Mobile frontend built with React Native + Expo
- 🌐 Deployed backend with REST API (Node.js + Express)
- 🧠 AI-powered grammar suggestions and fixes

---

## 🧩 Tech Stack

| Frontend | Backend | AI Engine | Deployment |
|----------|---------|-----------|------------|
| React Native (Expo) | Node.js, Express | OpenAI GPT-3.5 | Render (backend), Expo (mobile) |
| AsyncStorage for token storage | MongoDB Atlas | Custom AI prompt for grammar check | APK generated via EAS build |

---

## 🔗 Live Backend API

Base URL: `https://grammai-backend.onrender.com/api`

Example protected route:
POST /api/grammar/check
Authorization: Bearer <JWT>

---

## 📂 Project Structure

├── GrammAI-Backend
│   ├── server.js         # Main Express app
│   ├── models/User.js    # Mongoose User model
│   ├── db.js             # MongoDB connection logic
│   ├── .env              # API keys and secret config
│   └── package.json

├── GrammAI-GrammerCorrectionApp
│   ├── app/index.jsx     # Login Screen
│   ├── app/signup.jsx    # Signup Screen
│   ├── app/home.jsx      # Grammar Check UI
│   ├── env.js            # Contains API_BASE_URL
│   ├── eas.json          # Expo build config
│   └── app.json

---

🛠 Setup Instructions
1. Clone Repos

git clone https://github.com/M-AbdullahSarwar/GrammAI-Backend
git clone https://github.com/M-AbdullahSarwar/GrammAI-GrammerCorrectionApp

---

2. Backend Setup
cd GrammAI-Backend
npm install
Create a .env file:

env
MONGO_URI=<your_mongodb_connection_string>
OPENAI_API_KEY=<your_openai_api_key>
JWT_SECRET=your_jwt_secret

---

3. Frontend Setup (React Native)
cd GrammAI-GrammerCorrectionApp
npm install
npx expo start


---

## Live Demo

https://github.com/user-attachments/assets/9f50e911-aa91-4f01-9f1b-da203ae8d443



👨‍💻 Developed by
Abdullah Sarwar
GitHub: M-AbdullahSarwar
