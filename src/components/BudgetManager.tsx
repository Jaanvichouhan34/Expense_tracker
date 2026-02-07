import { useState } from 'react';
import { Target, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, Budget } from '../lib/supabase';

interface BudgetManagerProps {
  budgets: Budget[];
  onUpdate: () => void;
  darkMode: boolean;
  showManager: boolean;
  onToggle: () => void;
}

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Other',
];

export default function BudgetManager({
  budgets,
  onUpdate,
  darkMode,
  showManager,
  onToggle,
}: BudgetManagerProps) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [limit, setLimit] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase.from('budgets').upsert(
        {
          user_id: user.id,
          category,
          monthly_limit: parseFloat(limit),
        },
        { onConflict: 'user_id,category' }
      );

      if (error) throw error;

      setLimit('');
      onUpdate();
    } catch (error) {
      console.error('Error adding budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      const { error } = await supabase.from('budgets').delete().eq('id', id);

      if (error) throw error;

      onUpdate();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      } rounded-2xl shadow-sm border overflow-hidden transition-all`}
    >
      <button
        onClick={onToggle}
        className={`w-full p-6 flex items-center justify-between ${
          darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
        } transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <h2
            className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Budget Manager
          </h2>
        </div>
        {showManager ? (
          <ChevronUp className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
        ) : (
          <ChevronDown className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
        )}
      </button>

      {showManager && (
        <div className="px-6 pb-6 space-y-4 animate-slide-down">
          <form onSubmit={handleAddBudget} className="space-y-3">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-all outline-none ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Monthly Limit
              </label>
              <div className="relative">
                <span
                  className={`absolute left-3 top-2.5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className={`w-full pl-7 pr-3 py-2 rounded-lg border transition-all outline-none ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="0.00"
                  required
                  min="0.01"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Saving...' : 'Set Budget'}
            </button>
          </form>

          <div className="space-y-2">
            {budgets.length === 0 ? (
              <p
                className={`text-center py-4 text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                No budgets set yet
              </p>
            ) : (
              budgets.map((budget, index) => (
                <div
                  key={budget.id}
                  className={`flex items-center justify-between p-3 rounded-lg border animate-slide-in ${
                    darkMode
                      ? 'bg-gray-750 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div>
                    <p
                      className={`font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {budget.category}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      ${budget.monthly_limit.toFixed(2)}/month
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteBudget(budget.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? 'text-red-400 hover:bg-red-900/30'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
