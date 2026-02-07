# Quick Start Guide

Get your Smart Expense Tracker running in 3 minutes!

## Step 1: Set Up Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials to the `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

## Step 2: Start the Application

The database schema is already set up and the Edge Function is deployed!

Simply start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Step 3: Create Your Account

1. Click "Sign Up" on the login page
2. Enter any email and password (min 6 characters)
3. You'll be automatically logged in

## Step 4: Try It Out!

1. **Add an Expense**:
   - Click the "+ Add Expense" button
   - Enter an amount (e.g., $45.50)
   - Select a category (e.g., "Food & Dining")
   - Choose today's date
   - Add a note like "Lunch at Italian restaurant"
   - Click "Add Expense"

2. **Set a Budget**:
   - Click on "Budget Manager" in the right sidebar
   - Select "Food & Dining"
   - Set a limit (e.g., $500)
   - Click "Set Budget"

3. **View Analytics**:
   - See your expense appear in the pie chart
   - Try the bar chart and trend views
   - Watch the smooth animations!

4. **Toggle Dark Mode**:
   - Click the moon icon in the top-right corner

## Features to Explore

- ✅ Add multiple expenses across different categories
- ✅ Edit or delete existing expenses
- ✅ Set budgets for different categories
- ✅ Get real-time budget alerts when overspending
- ✅ View spending trends over time
- ✅ AI insights will generate automatically (refresh to update)
- ✅ Switch between light and dark themes
- ✅ Enjoy smooth animations throughout the app

## Sample Data to Try

Add these expenses to see the full power of analytics:

- $55.00 - Food & Dining - "Dinner with friends"
- $25.00 - Transportation - "Uber to work"
- $120.00 - Shopping - "New shoes"
- $45.00 - Entertainment - "Movie tickets"
- $80.00 - Groceries - "Weekly grocery shopping"
- $150.00 - Bills & Utilities - "Electric bill"

## Need Help?

Check the full README.md for:
- Complete feature documentation
- Technical architecture details
- Security features
- Customization options

## Next Steps

Once you're comfortable with the app:
1. Set realistic budgets for your spending habits
2. Add expenses daily to build accurate patterns
3. Review AI insights weekly for saving opportunities
4. Export your data or build new features!

Enjoy your Smart Expense Tracker! 🎉
