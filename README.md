# 🎯 FocusPod – Your Ultimate Study Companion

FocusPod is a full-stack productivity platform designed to help individuals and groups stay focused and accountable during study sessions. With features like real-time group timers, solo focus rooms, AI-powered assistance, goal tracking, and detailed progress insights, FocusPod is built to make studying not just effective—but engaging.

---

## 🚀 Features

### 🔒 Authentication
- Email + Password login
- Google Sign-In (via Firebase)
- OTP Verification system

### 🧑‍💻 Study Modes
- **Solo Focus Room** – Track your personal sessions, set study goals, and stay on task
- **Group Focus Room** – Join virtual study rooms with synchronized timers and group chat
- Pomodoro and Custom Timers with room creator controls

### 📈 Productivity Tracking
- Daily study time & completed sessions
- Weekly productivity heatmap
- Streak tracking
- Session goals with checklist
- Soft-Subtle Music for better focus

### 💬 AI Assistant
- Real-time AI chatbot powered via OpenRouter
- Get study help, motivational support, and instant summaries

### 🧠 Notes & Goals
- Goal of the session: Add, track, and mark goals
- Session-specific notes .

### 🧑 Profile Section
- Update name & password
- View personal stats and progress

---

## 🛠️ Tech Stack

### 💻 Frontend
- React.js
- React Router
- Tailwind CSS
- Socket.IO Client

### 🖥 Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO Server
- OpenRouter (for AI)
- Firebase (for Google Auth)
- Nodemailer (for OTP emails)

---

## ⚙️ Installation

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
- Firebase project for Google Auth
- OpenRouter API key for AI

### Clone the Repository
```bash
git clone https://github.com/26tanya/FocusPod.git
cd FocusPod
```

### Backend Setup
```bash
cd server
npm install
# Create a `.env` file with:
# MONGO_URI=your_mongodb_url
# JWT_SECRET=your_secret_key
# EMAIL_USER=your_email
# EMAIL_PASS=your_email_password
# OPENROUTER_API_KEY=your_key
npm run dev
```


### Frontend Setup
```bash
cd client
npm install
npm start
```

###📌 Project Structure
```bash
FocusPod/
├── client/         # React Frontend
├── server/         # Node.js Backend
├── README.md
```

### 📅 **Upcoming Features**
Productivity badges & leaderboards

Distraction blocker browser extension

Session history & export

Calendar-based analytics

### 🙌 **Contributions**:
Contributions are welcome! Feel free to fork this repo and submit a pull request.

### 📄 **License**:
This project is open source and available under the MIT License.

