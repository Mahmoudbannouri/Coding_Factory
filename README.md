# 📚 Coding Factory – Smart Modular EdTech Platform

A modular, scalable Course Management System developed as part of the **CS404 - Software Engineering** curriculum at **Esprit School of Engineering**. Built with a microservices architecture, this system integrates course, event, partnership, PFE, and evaluation management into a cohesive educational platform powered by AI.

---

## 🔍 Overview

Coding Factory provides a smart and centralized platform for managing educational workflows. From course creation to AI-powered recommendations, this system enhances user experience and automates key academic operations.

---

## ✨ Features

### 📘 Course Management
- Create, update, and delete courses  
- Upload multimedia content (PDFs, videos, docs) to **Supabase**  
- Advanced search, filtering, and pagination  
- PDF generation & ZIP file export for course content  
- AI-generated review suggestions using **Gemini AI**  
- Flask-based recommendation system based on enrolled courses  

### 📅 Event Management
- Create and manage events  
- Track participant registration  
- Sync events to Google Calendar / export as ICS  

### 👤 User Management
- Role-based user registration (Student, Instructor, Admin)  
- JWT-secured login/signup  
- Profile updates and password reset via OTP  

### 🧾 PFE Management
- Submit and manage PFE proposals  
- Deliverable uploads with instructor feedback  
- Schedule and track project meetings  

### 📝 Evaluation Management
- Create quizzes and exams  
- Real-time feedback and AI-enhanced learning paths  
- Generate and send certifications  

### 🤝 Partnership Management
A robust and intelligent module empowering admins to manage partnerships with external companies efficiently and strategically.

**Key Capabilities:**
- Manage company profiles and explore partnership proposals  
- Companies can browse proposals and apply based on interest  
- Generate and customize partnership contracts with electronic signature support  
- Track partnership performance and deal history  

**Smart Automation & AI Integration:**
- 🔍 Web scraping tool (Python + Selenium) helps discover relevant companies quickly  
- 📧 Built-in cold email sender for outreach and onboarding  
- 🤖 AI-powered recommendation system (Flask + SVC model) suggests top potential partners based on admin profiles  
- 💬 Integrated chatbot assistant (FuzzyWuzzy + TF-IDF) answers dynamic partnership-related queries in real time  

---

## 🛠️ Tech Stack

### Frontend
- Angular 16  
- Bootstrap  

### Backend
- Spring Boot  
- Spring Security (JWT)  
- MySQL, JPA (Hibernate)  

### Cloud & AI
- Supabase (Cloud Storage)  
- Gemini AI (Review Suggestions)  
- Flask + Scikit-learn (ML Recommendations)  

### Microservices
- Spring Cloud (Eureka Service Discovery)  
- API Gateway  
- Feign Clients for inter-service communication  

---

## 🚀 Architecture Highlights
- Modular Microservices for each domain (Course, Event, User, etc.)  
- Centralized authentication & secure routing via API Gateway  
- AI-enhanced UX with smart suggestions and automation  
- Scalable infrastructure for real-world educational systems  

---

## 📂 Getting Started

> Coming soon: setup instructions, environment configuration, and build steps.

---

## 🤝 Team Contribution

This system was developed collaboratively by students at **Esprit School of Engineering** as part of the **Coding Factory** platform.
