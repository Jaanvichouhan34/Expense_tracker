<div align="center">

# 💰 SMART EXPENSE TRACKER

**A robust FinTech dashboard featuring real-time expense tracking, secure authentication, and data visualization.**

[![GitHub stars](https://img.shields.io/github/stars/Jaanvichouhan34/Expense_tracker?color=green&style=for-the-badge)](https://github.com/Jaanvichouhan34/Expense_tracker/stargazers)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

[Explore Live Demo](https://expensetracker-five-mu.vercel.app/) • [Report Bug](https://github.com/Jaanvichouhan34/Expense_tracker/issues)

</div>

---

## 🌟 Overview
The Smart Expense Tracker is a full-stack personal finance application built with **React**, **Vite**, and **Supabase**. It provides users with a secure environment to manage their daily transactions, visualize spending habits through interactive charts, and maintain data privacy using PostgreSQL Row Level Security (RLS).

🔗 **Live Demo:** [Click Here](https://expensetracker-five-mu.vercel.app/)  
📦 **GitHub Repo:** [Click Here](https://github.com/Jaanvichouhan34/Expense_tracker)

## ✨ Key Features
- **Secure Authentication**: Robust login and signup flow powered by Supabase Auth (Email/Password).
- **Real-Time CRUD**: Add, view, and delete expenses with instant UI updates and database synchronization.
- **Spending Analytics**: Visual breakdown of expenses by category using Chart.js/Lucide-react components.
- **Privacy First**: Implements Row Level Security (RLS) so users can only access their personal financial data.
- **Responsive UI**: A clean, dark-themed dashboard optimized for all devices using Tailwind CSS.

## 🛠️ Tech Stack
- **Frontend**: React (Vite) & TypeScript
- **Styling**: Tailwind CSS
- **Backend/Auth**: Supabase (PostgreSQL)
- **Icons/UI**: Lucide React
- **Deployment**: Vercel

## 📋 Database Architecture
The backend is built on **PostgreSQL** via Supabase. The `expenses` table is structured as follows:
- **`user_id`**: Links transactions to specific authenticated users.
- **`amount`**: Stored as decimal for financial precision.
- **`category`**: Dynamic categorization (Food, Transport, Bills, etc.).
- **`RLS Policies`**: Strict access control prevents unauthorized data leaks.

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/Jaanvichouhan34/Expense_tracker.git](https://github.com/Jaanvichouhan34/Expense_tracker.git)
   cd Expense_tracker
   
 2. **Install dependencies**
      ```bash
     npm install
      
3. **Set up Environment Variables Create a .env file and add your Supabase credentials:**

     ```bash
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key

3. **Launch Project**
     ```bash
     npm run dev 

## 📬 Contact

Developed by Jaanvi Chouhan//////

- 🔗 [GitHub](https://github.com/Jaanvichouhan34)  
- 💼 [LinkedIn](https://www.linkedin.com/in/jaanvi-chouhan-b83158313)
- 📸 [Instagram](https://www.instagram.com/jaanvi_chouhan18)

