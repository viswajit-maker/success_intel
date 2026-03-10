# 🎓 Success Intel

### AI-Driven Student Success & Academic Analytics Platform

## 📌 Overview

**Success Intel** is an AI-powered student success platform designed to help educational institutions identify struggling students early and improve academic outcomes through data-driven insights.

Traditional academic systems mainly store student records but do not provide intelligent insights. Success Intel transforms academic data into **predictive analytics**, enabling educators to detect risks early and take proactive interventions.

The platform integrates **AI-based student risk prediction, role-based dashboards, academic analytics, and a Career Hub for skill development** into one unified ecosystem.

---

# 🚀 Key Features

## 👨‍🎓 Student Dashboard

* View academic performance
* Track attendance trends
* Monitor assignment completion
* AI-generated academic risk level
* Notifications and updates
* Timetable & Exam schedules
* Access to **Career Hub**

---

## 👩‍🏫 Teacher Dashboard

* Manage students
* View class performance analytics
* Identify at-risk students
* Generate academic reports
* Track assignment completion

---

## 👨‍👩‍👧 Parent Dashboard

* Monitor child’s academic progress
* View attendance history
* Track performance trends
* Schedule teacher meetings

---

## 🏫 Admin Dashboard

* Institutional success analytics
* Department performance monitoring
* Manage teachers and departments
* Generate reports
* View student risk distribution

---

# 🤖 AI-Powered Risk Prediction

The platform uses a **Machine Learning model** to predict student academic risk levels.

### Input Indicators

* Attendance Percentage
* Average Marks
* Assignment Completion Rate
* Participation Score

### Student Success Intelligence Score (SSIS)

SSIS =
0.30 × Attendance
0.40 × Marks
0.20 × Assignments
0.10 × Participation

### Risk Categories

| SSIS Score | Risk Level  |
| ---------- | ----------- |
| ≥ 80       | Low Risk    |
| 60–79      | Medium Risk |
| < 60       | High Risk   |

The system uses a **Random Forest Classifier** trained with Scikit-learn to predict risk levels.

---

# 🎯 Career Hub

Career Hub helps students develop industry skills by connecting them with real-world opportunities.

### Features

* Browse online courses
* Explore internships
* View certifications
* Filter opportunities by category
* Save opportunities for later

### Platforms Integrated

* Coursera
* Udemy
* LinkedIn Learning
* AWS Training
* Google Cloud Skills
* Internshala
* edX

Students can directly access external learning resources to improve career readiness.

---

# 🧩 System Architecture

Frontend
→ React + TypeScript + Vite

Backend
→ Node.js + TypeScript

AI Engine
→ Python + Flask + Scikit-learn

Database
→ SQL Schema

```
Frontend (React)
        │
Backend API (Node.js)
        │
AI Prediction Service (Python Flask)
        │
Machine Learning Model (Random Forest)
```

This modular architecture allows independent scaling of each layer.

---

# 🛠️ Technologies Used

### Frontend

* React
* TypeScript
* Vite
* Chart.js

### Backend

* Node.js
* Express
* TypeScript

### AI Engine

* Python
* Flask
* Scikit-learn
* NumPy
* Pandas
* Joblib

### Database

* SQL

---

# 📊 Analytics & Insights

The system provides visual dashboards including:

* Attendance trends
* Subject performance analysis
* Risk distribution charts
* Department performance analytics
* Institutional success metrics

These insights help educators make **data-driven academic decisions**.

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/success-intel.git
cd success-intel
```

---

## 2️⃣ Install Node Dependencies

```bash
npm install
```

---

## 3️⃣ Start Backend Server

```bash
npx ts-node server.ts
```

---

## 4️⃣ Start AI Prediction Service

Navigate to the AI engine folder:

```bash
cd ai-engine
```

Install Python dependencies:

```bash
pip install flask flask-cors scikit-learn joblib numpy pandas python-dotenv
```

Run the AI service:

```bash
python app.py
```

---

## 5️⃣ Start Frontend

```bash
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

# 🔐 Demo Accounts

### Admin

Email: [admin@successintel.com](mailto:admin@successintel.com)
Password: admin123

### Teacher

Login as Demo Teacher

### Student

Login as Demo Student

### Parent

Login as Demo Parent

---

# 📈 Future Improvements

* Integration with real institutional datasets
* Cloud deployment
* Continuous AI model training
* Advanced predictive analytics
* Mobile application
* Integration with university ERP systems

---

# 💡 Innovation

Success Intel transforms traditional academic management systems into a **predictive student success platform** by combining:

* AI-based risk prediction
* multi-role academic dashboards
* analytics-driven decision making
* career development support

This enables institutions to **identify struggling students early and improve educational outcomes**.

---

# 👨‍💻 Team

Developed as part of a **Hackathon Project** focused on improving student success through intelligent analytics and AI-driven insights.

---

# 📄 License

This project is created for educational and demonstration purposes.
