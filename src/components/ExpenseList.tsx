import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { Expense } from '../lib/supabase';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Food & Dining': 'bg-orange-100 text-orange-700',
    Transportation: 'bg-blue-100 text-blue-700',
    Shopping: 'bg-pink-100 text-pink-700',
    Entertainment: 'bg-purple-100 text-purple-700',
    'Bills & Utilities': 'bg-red-100 text-red-700',
    Healthcare: 'bg-green-100 text-green-700',
    Education: 'bg-indigo-100 text-indigo-700',
    Travel: 'bg-cyan-100 text-cyan-700',
    Groceries: 'bg-lime-100 text-lime-700',
    Other: 'bg-gray-100 text-gray-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Tag className="w-16 h-16 mx-auto" />
        </div>
        <p className="text-gray-600 text-lg">No expenses yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Click the + button to add your first expense
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense, index) => (
        <div
          key={expense.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all animate-slide-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    expense.category
                  )}`}
                >
                  {expense.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(expense.expense_date).toLocaleDateString()}
                </div>
              </div>
              {expense.description && (
                <p className="text-gray-700 text-sm mb-2">
                  {expense.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-900">
                ${expense.amount.toFixed(2)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit expense"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
