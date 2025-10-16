# 🏋️‍♂️ FitTrack — Fitness Tracking Web App

![MERN](https://img.shields.io/badge/Stack-MERN-green?style=flat-square)
![Authentication](https://img.shields.io/badge/Auth-Secure-blue?style=flat-square)
![Responsive](https://img.shields.io/badge/UI-Responsive-orange?style=flat-square)
![Personal Project](https://img.shields.io/badge/Project-Type%3A%20Personal-lightgrey?style=flat-square)
![AI](https://img.shields.io/badge/Powered%20By-AI-purple?style=flat-square)

**FitTrack** is a full-stack fitness tracking web application that helps users monitor their workouts, meals, and calorie intake effortlessly.  
With an interactive dashboard, users can set fitness goals, view their progress through analytics, and maintain a healthy lifestyle — all in one place.

---

## ✨ Features

- 🔐 **User Authentication** — Secure login and signup system.  
- 🏋️ **Exercise Tracking** — Add daily workouts with automatic calorie calculations.  
- 🍎 **Meal Logging** — Log meals and view estimated calorie intake.  
- 📊 **Progress Analytics** — Visual charts showing calories burned, consumed, and goals achieved.  
- 🎯 **Goal Management** — Set and track daily or weekly fitness goals.  
- ⏰ **Reminders & Alerts** — Stay consistent with workout and meal reminders.  
- 📱 **Responsive UI** — Fully optimized for mobile and desktop screens.  

---

## 🧩 Tech Stack

**Frontend:**  
- React.js  
- Tailwind CSS  
- Axios  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB (via Mongoose)  

**Other Tools:**  
- JWT for Authentication  
- Chart.js / Recharts for Analytics  
- bcrypt for Password Hashing  

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/fittrack.git
cd fittrack

```
Backend
```bash
cd backend
npm install
```
Frontend
```bash
cd ../frontend
npm install
```
Set up Environment Variables

in backend .env
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
in frontend .env
```bash
VITE_BACKEND_URL=http://localhost:5000

```
Run both frontend and backend
```bash
cd backend
npm run dev
cd ../frontend
npm run dev
```
🗂️ Folder Structure
```
fittrack/
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   ├── .env
│   └── vite.config.js
│
└── README.md

```

📅 Future Enhancements
```
🧾 Add custom meal and exercise categories

🔔 Integrate notification system for reminders

🧠 Add weekly progress summaries

🌙 Add dark/light mode toggle
```
🧑‍💻 Author

  Rajeev Dixit
  📧 [dixitrajeev5202@gmail.com]
  
  💼 [https://www.linkedin.com/in/rajeev-dixit-892526346/]

⭐ If you like this project, don’t forget to star the repo on GitHub!

🪪 License

This project is licensed under the MIT License — feel free to use and modify it for learning or personal projects.
