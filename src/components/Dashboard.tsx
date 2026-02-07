import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Expense, Budget, AIInsight } from '../lib/supabase';
import {
  Plus,
  LogOut,
  TrendingUp,
  DollarSign,
  Calendar,
  Sparkles,
  Moon,
  Sun,
} from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import SpendingCharts from './SpendingCharts';
import BudgetManager from './BudgetManager';
import AIInsights from './AIInsights';
import Toast from './Toast';

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showBudgetManager, setShowBudgetManager] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expensesRes, budgetsRes, insightsRes] = await Promise.all([
        supabase
          .from('expenses')
          .select('*')
          .order('expense_date', { ascending: false }),
        supabase.from('budgets').select('*'),
        supabase
          .from('ai_insights')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (expensesRes.data) setExpenses(expensesRes.data);
      if (budgetsRes.data) setBudgets(budgetsRes.data);
      if (insightsRes.data) setInsights(insightsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);

      if (error) throw error;

      setExpenses(expenses.filter((e) => e.id !== id));
      showToast('Expense deleted successfully', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning'
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const checkBudgetAlerts = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.expense_date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    budgets.forEach((budget) => {
      const categoryTotal = monthExpenses
        .filter((e) => e.category === budget.category)
        .reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);

      if (categoryTotal > budget.monthly_limit) {
        showToast(
          `Budget exceeded for ${budget.category}! Spent $${categoryTotal.toFixed(2)} of $${budget.monthly_limit.toFixed(2)}`,
          'warning'
        );
      }
    });
  };

  useEffect(() => {
    if (expenses.length > 0 && budgets.length > 0) {
      checkBudgetAlerts();
    }
  }, [expenses, budgets]);

  const totalSpent = expenses.reduce(
    (sum, e) => sum + parseFloat(e.amount.toString()),
    0
  );

  const currentMonth = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const monthExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.expense_date);
    const now = new Date();
    return (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  });

  const monthTotal = monthExpenses.reduce(
    (sum, e) => sum + parseFloat(e.amount.toString()),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <header
        className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
        } shadow-sm border-b sticky top-0 z-40 transition-colors`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Smart Expense Tracker
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => signOut()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-2xl shadow-sm p-6 border ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            } animate-fade-in`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3
              className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              } mb-1`}
            >
              Total Spent
            </h3>
            <p
              className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              ${totalSpent.toFixed(2)}
            </p>
          </div>

          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-2xl shadow-sm p-6 border ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            } animate-fade-in`}
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3
              className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              } mb-1`}
            >
              This Month
            </h3>
            <p
              className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              ${monthTotal.toFixed(2)}
            </p>
            <p
              className={`text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              } mt-1`}
            >
              {currentMonth}
            </p>
          </div>

          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-2xl shadow-sm p-6 border ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            } animate-fade-in`}
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3
              className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              } mb-1`}
            >
              Transactions
            </h3>
            <p
              className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {expenses.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SpendingCharts expenses={expenses} darkMode={darkMode} />
          </div>
          <div>
            <AIInsights
              insights={insights}
              darkMode={darkMode}
              onRefresh={fetchData}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div
              className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-2xl shadow-sm p-6 border ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Recent Expenses
                </h2>
                <button
                  onClick={() => {
                    setEditingExpense(null);
                    setShowExpenseForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </button>
              </div>
              <ExpenseList
                expenses={expenses}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            </div>
          </div>

          <div>
            <BudgetManager
              budgets={budgets}
              onUpdate={fetchData}
              darkMode={darkMode}
              showManager={showBudgetManager}
              onToggle={() => setShowBudgetManager(!showBudgetManager)}
            />
          </div>
        </div>
      </main>

      {showExpenseForm && (
        <ExpenseForm
          onClose={() => {
            setShowExpenseForm(false);
            setEditingExpense(null);
          }}
          onSuccess={() => {
            fetchData();
            showToast(
              editingExpense
                ? 'Expense updated successfully'
                : 'Expense added successfully',
              'success'
            );
          }}
          editExpense={editingExpense}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
