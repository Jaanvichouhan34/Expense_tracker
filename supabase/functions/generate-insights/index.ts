import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Expense {
  amount: number;
  category: string;
  expense_date: string;
}

interface Budget {
  category: string;
  monthly_limit: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const [expensesRes, budgetsRes] = await Promise.all([
      supabase
        .from("expenses")
        .select("amount, category, expense_date")
        .order("expense_date", { ascending: false }),
      supabase.from("budgets").select("category, monthly_limit"),
    ]);

    if (expensesRes.error) throw expensesRes.error;
    if (budgetsRes.error) throw budgetsRes.error;

    const expenses: Expense[] = expensesRes.data || [];
    const budgets: Budget[] = budgetsRes.data || [];

    const insights = generateInsights(expenses, budgets);

    const { error: deleteError } = await supabase
      .from("ai_insights")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) console.error("Error deleting old insights:", deleteError);

    const insightsToInsert = insights.map((insight) => ({
      user_id: user.id,
      insight_text: insight.text,
      insight_type: insight.type,
      is_read: false,
    }));

    if (insightsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("ai_insights")
        .insert(insightsToInsert);

      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        insights: insightsToInsert,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateInsights(
  expenses: Expense[],
  budgets: Budget[]
): Array<{ text: string; type: string }> {
  const insights: Array<{ text: string; type: string }> = [];

  if (expenses.length === 0) {
    return [
      {
        text: "Start tracking your expenses to get personalized insights and saving tips!",
        type: "tip",
      },
    ];
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.expense_date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const lastMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.expense_date);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  const categoryTotals: { [key: string]: number } = {};
  currentMonthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + parseFloat(e.amount.toString());
  });

  const lastMonthCategoryTotals: { [key: string]: number } = {};
  lastMonthExpenses.forEach((e) => {
    lastMonthCategoryTotals[e.category] = (lastMonthCategoryTotals[e.category] || 0) + parseFloat(e.amount.toString());
  });

  budgets.forEach((budget) => {
    const spent = categoryTotals[budget.category] || 0;
    const percentage = (spent / budget.monthly_limit) * 100;

    if (percentage > 100) {
      insights.push({
        text: `You've exceeded your ${budget.category} budget by $${(spent - budget.monthly_limit).toFixed(2)}. Consider reducing spending in this category.`,
        type: "warning",
      });
    } else if (percentage > 80) {
      insights.push({
        text: `You're at ${percentage.toFixed(0)}% of your ${budget.category} budget. Be mindful of remaining spending this month.`,
        type: "warning",
      });
    } else if (percentage < 50) {
      insights.push({
        text: `Great job! You're only using ${percentage.toFixed(0)}% of your ${budget.category} budget. Keep up the good work!`,
        type: "achievement",
      });
    }
  });

  Object.keys(categoryTotals).forEach((category) => {
    const currentSpent = categoryTotals[category];
    const lastSpent = lastMonthCategoryTotals[category] || 0;

    if (lastSpent > 0) {
      const change = ((currentSpent - lastSpent) / lastSpent) * 100;

      if (change > 30) {
        insights.push({
          text: `Your ${category} spending increased by ${change.toFixed(0)}% compared to last month. Look for ways to cut back.`,
          type: "warning",
        });
      } else if (change < -20) {
        insights.push({
          text: `Excellent! You reduced ${category} spending by ${Math.abs(change).toFixed(0)}% this month. You saved $${(lastSpent - currentSpent).toFixed(2)}!`,
          type: "achievement",
        });
      }
    }
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length > 0) {
    const topCategory = sortedCategories[0];
    const topSpending = topCategory[1];
    const totalSpending = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    const topPercentage = (topSpending / totalSpending) * 100;

    if (topPercentage > 40) {
      insights.push({
        text: `${topCategory[0]} accounts for ${topPercentage.toFixed(0)}% of your spending. Consider finding alternatives or setting a stricter budget.`,
        type: "tip",
      });
    }
  }

  if (sortedCategories.some(([cat]) => cat === "Food & Dining")) {
    const diningSpent = categoryTotals["Food & Dining"];
    const grocerySpent = categoryTotals["Groceries"] || 0;

    if (diningSpent > grocerySpent * 2) {
      const savings = (diningSpent * 0.3).toFixed(2);
      insights.push({
        text: `You spend significantly more on dining out than groceries. Cooking at home 2-3 times more per week could save you ~$${savings}/month.`,
        type: "tip",
      });
    }
  }

  const weekExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.expense_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return expenseDate >= weekAgo;
  });

  const avgDailySpending = weekExpenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0) / 7;

  if (avgDailySpending > 50) {
    insights.push({
      text: `Your average daily spending is $${avgDailySpending.toFixed(2)}. Setting daily spending limits can help you save more.`,
      type: "tip",
    });
  }

  if (insights.length === 0) {
    insights.push({
      text: "Your spending looks balanced! Keep tracking to maintain good financial habits.",
      type: "achievement",
    });
  }

  return insights.slice(0, 5);
}
