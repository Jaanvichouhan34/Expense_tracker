import { useState } from 'react';
import { Expense } from '../lib/supabase';
import { PieChart, BarChart3, TrendingUp } from 'lucide-react';

interface SpendingChartsProps {
  expenses: Expense[];
  darkMode: boolean;
}

export default function SpendingCharts({
  expenses,
  darkMode,
}: SpendingChartsProps) {
  const [activeChart, setActiveChart] = useState<'pie' | 'bar' | 'trend'>('pie');

  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount.toString());
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + amount;
    });
    return Object.entries(categoryTotals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  };

  const getMonthlyTrend = () => {
    const monthlyData: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      const date = new Date(expense.expense_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const amount = parseFloat(expense.amount.toString());
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + amount;
    });
    return Object.entries(monthlyData)
      .sort()
      .slice(-6)
      .map(([month, total]) => ({ month, total }));
  };

  const categoryData = getCategoryData();
  const monthlyTrend = getMonthlyTrend();
  const total = categoryData.reduce((sum, item) => sum + item.total, 0);

  const categoryColors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
    '#F97316',
    '#6366F1',
  ];

  const PieChartView = () => {
    let currentAngle = 0;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    return (
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        <svg width="200" height="200" viewBox="0 0 200 200" className="animate-fade-in">
          {categoryData.map((item, index) => {
            const percentage = (item.total / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const startX =
              centerX + radius * Math.cos((Math.PI * startAngle) / 180);
            const startY =
              centerY + radius * Math.sin((Math.PI * startAngle) / 180);
            const endX = centerX + radius * Math.cos((Math.PI * endAngle) / 180);
            const endY = centerY + radius * Math.sin((Math.PI * endAngle) / 180);

            const largeArc = angle > 180 ? 1 : 0;

            const path = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;

            currentAngle += angle;

            return (
              <g key={item.category} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <path
                  d={path}
                  fill={categoryColors[index % categoryColors.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  style={{
                    transformOrigin: '100px 100px',
                  }}
                />
              </g>
            );
          })}
        </svg>

        <div className="space-y-2">
          {categoryData.map((item, index) => (
            <div
              key={item.category}
              className="flex items-center gap-3 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: categoryColors[index % categoryColors.length],
                }}
              />
              <span
                className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                } flex-1`}
              >
                {item.category}
              </span>
              <span
                className={`text-sm font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                ${item.total.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">
                ({((item.total / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BarChartView = () => {
    const maxValue = Math.max(...categoryData.map((item) => item.total));

    return (
      <div className="space-y-4">
        {categoryData.map((item, index) => {
          const percentage = (item.total / maxValue) * 100;
          return (
            <div key={item.category} className="animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {item.category}
                </span>
                <span
                  className={`text-sm font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  ${item.total.toFixed(2)}
                </span>
              </div>
              <div className={`h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg overflow-hidden`}>
                <div
                  className="h-full rounded-lg transition-all duration-1000 ease-out animate-bar-grow"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(to right, ${
                      categoryColors[index % categoryColors.length]
                    }, ${categoryColors[(index + 1) % categoryColors.length]})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const TrendChartView = () => {
    if (monthlyTrend.length === 0) {
      return (
        <div className="text-center py-12">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Not enough data to show trends
          </p>
        </div>
      );
    }

    const maxValue = Math.max(...monthlyTrend.map((item) => item.total));
    const chartHeight = 200;
    const chartWidth = 500;
    const padding = 40;

    const points = monthlyTrend.map((item, index) => {
      const x =
        padding + (index * (chartWidth - padding * 2)) / (monthlyTrend.length - 1);
      const y =
        chartHeight - padding - ((item.total / maxValue) * (chartHeight - padding * 2));
      return { x, y, ...item };
    });

    const pathD = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    return (
      <div className="overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="animate-fade-in"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            className="animate-draw-line"
            style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
          />

          {points.map((point, index) => (
            <g key={index} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <circle cx={point.x} cy={point.y} r="6" fill="#3B82F6" />
              <text
                x={point.x}
                y={chartHeight - 10}
                textAnchor="middle"
                className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}
              >
                {new Date(point.month).toLocaleDateString('en-US', {
                  month: 'short',
                })}
              </text>
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                className={`text-xs font-semibold ${
                  darkMode ? 'fill-white' : 'fill-gray-900'
                }`}
              >
                ${point.total.toFixed(0)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  if (expenses.length === 0) {
    return (
      <div
        className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        } rounded-2xl shadow-sm p-6 border`}
      >
        <h2
          className={`text-xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Spending Analytics
        </h2>
        <div className="text-center py-12">
          <div className={`${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}>
            <BarChart3 className="w-16 h-16 mx-auto" />
          </div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            No data to display yet
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Add some expenses to see your spending analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      } rounded-2xl shadow-sm p-6 border`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Spending Analytics
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveChart('pie')}
            className={`p-2 rounded-lg transition-all ${
              activeChart === 'pie'
                ? 'bg-blue-500 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Pie Chart"
          >
            <PieChart className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveChart('bar')}
            className={`p-2 rounded-lg transition-all ${
              activeChart === 'bar'
                ? 'bg-blue-500 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveChart('trend')}
            className={`p-2 rounded-lg transition-all ${
              activeChart === 'trend'
                ? 'bg-blue-500 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Trend Chart"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="min-h-[300px] flex items-center justify-center">
        {activeChart === 'pie' && <PieChartView />}
        {activeChart === 'bar' && <BarChartView />}
        {activeChart === 'trend' && <TrendChartView />}
      </div>
    </div>
  );
}
