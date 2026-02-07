# Smart Expense Tracker with AI Insights

A full-stack, production-ready expense tracking application with AI-powered insights, interactive analytics, and real-time budget monitoring.

## Features

### Core Functionality
- **Expense Management**: Add, edit, delete expenses with categories, dates, and notes
- **Interactive Analytics**:
  - Pie charts showing spending by category
  - Bar charts for comparative analysis
  - Trend charts showing monthly spending patterns
- **Budget Tracking**: Set monthly budgets per category with automatic alerts
- **AI-Powered Insights**: Get personalized saving recommendations based on spending patterns
- **Real-time Notifications**: Toast notifications for budget alerts and actions
- **Dark Mode**: Toggle between light and dark themes
- **User Authentication**: Secure email/password authentication

### Technical Highlights
- **Modern React Architecture**: Built with React 18, TypeScript, and Vite
- **Supabase Backend**: PostgreSQL database with Row Level Security
- **Edge Functions**: Serverless AI insight generation
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: Custom CSS animations for professional UX
- **Real-time Updates**: Instant data synchronization

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (icons)

### Backend
- Supabase (PostgreSQL)
- Supabase Auth
- Supabase Edge Functions
- Row Level Security (RLS)

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Auth.tsx              # Login/Signup component
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── ExpenseForm.tsx       # Add/Edit expense modal
│   │   ├── ExpenseList.tsx       # List of expenses
│   │   ├── SpendingCharts.tsx    # Interactive charts
│   │   ├── BudgetManager.tsx     # Budget management
│   │   ├── AIInsights.tsx        # AI insights display
│   │   └── Toast.tsx             # Notification component
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication context
│   ├── lib/
│   │   └── supabase.ts           # Supabase client setup
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles + animations
├── supabase/
│   └── functions/
│       └── generate-insights/    # AI insights Edge Function
└── .env.example                  # Environment variables template
```

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- A Supabase account

### 2. Environment Variables
Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup
The database schema has already been applied with the following tables:
- `expenses` - Stores all expense records
- `budgets` - Stores budget limits per category
- `ai_insights` - Stores AI-generated insights

All tables have Row Level Security (RLS) enabled for secure data access.

### 5. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm run preview
```

## Usage Guide

### Getting Started
1. **Sign Up**: Create an account with email and password
2. **Add Expenses**: Click the "Add Expense" button to record your first expense
3. **Set Budgets**: Open Budget Manager to set monthly spending limits
4. **View Analytics**: Explore different chart views (pie, bar, trend)
5. **Get AI Insights**: The system automatically generates insights based on your spending

### Key Features Walkthrough

**Adding Expenses:**
- Click "+ Add Expense" button
- Enter amount, select category, choose date
- Add optional description
- Submit to save

**Managing Budgets:**
- Click "Budget Manager" in the sidebar
- Select a category and set monthly limit
- Get automatic alerts when approaching or exceeding limits

**AI Insights:**
- System analyzes spending patterns automatically
- Compares current vs. previous month
- Identifies overspending categories
- Provides actionable saving recommendations
- Celebrates achievements for staying under budget

**Interactive Charts:**
- Toggle between pie, bar, and trend views
- Hover over elements for detailed information
- Watch smooth animations as data updates

### Categories
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Groceries
- Other

## AI Insights Logic

The Edge Function analyzes your spending data to generate:

1. **Budget Alerts**: Warnings when exceeding category budgets
2. **Trend Analysis**: Comparison with previous month spending
3. **Top Spender Insights**: Highlights categories consuming most budget
4. **Savings Opportunities**: Suggests areas to cut back (e.g., dining vs. groceries)
5. **Daily Spending Patterns**: Identifies high daily average spending
6. **Achievements**: Celebrates staying under budget

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Authenticated Routes**: All API calls require valid authentication
- **Secure Password Storage**: Handled by Supabase Auth
- **JWT Token Validation**: Edge Functions verify user tokens
- **No Exposed Secrets**: API keys stored in environment variables

## Performance Optimizations

- Lazy loading of components
- Optimized bundle size with tree shaking
- CSS animations using GPU acceleration
- Efficient database queries with indexes
- Minimal re-renders with React hooks

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features to add:
- Export reports as PDF
- Recurring expenses
- Split expenses with others
- Receipt photo uploads
- Multi-currency support
- Voice expense entry
- Data visualization improvements

## Resume/Portfolio Highlights

This project demonstrates:
- **Full-Stack Development**: Frontend + Backend + Database
- **Modern React Patterns**: Hooks, Context API, TypeScript
- **Database Design**: Schema design, RLS policies, indexes
- **Serverless Architecture**: Edge Functions for AI processing
- **Authentication**: Secure user management
- **Data Visualization**: Custom interactive charts
- **UX/UI Design**: Professional animations and responsive design
- **AI Integration**: Pattern recognition and recommendation engine
- **Production-Ready Code**: Clean architecture, error handling, security

## License

MIT

## Author

Built as a portfolio project to demonstrate full-stack development skills.
