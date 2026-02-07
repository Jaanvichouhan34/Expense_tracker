import { Sparkles, RefreshCw, Lightbulb, AlertTriangle, Trophy } from 'lucide-react';
import { AIInsight } from '../lib/supabase';

interface AIInsightsProps {
  insights: AIInsight[];
  darkMode: boolean;
  onRefresh: () => void;
}

export default function AIInsights({
  insights,
  darkMode,
  onRefresh,
}: AIInsightsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'warning':
        return darkMode
          ? 'bg-yellow-900/30 border-yellow-700 text-yellow-300'
          : 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'achievement':
        return darkMode
          ? 'bg-green-900/30 border-green-700 text-green-300'
          : 'bg-green-50 border-green-200 text-green-800';
      default:
        return darkMode
          ? 'bg-blue-900/30 border-blue-700 text-blue-300'
          : 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      } rounded-2xl shadow-sm border p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <h2
            className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            AI Insights
          </h2>
        </div>
        <button
          onClick={onRefresh}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'text-gray-400 hover:bg-gray-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Refresh insights"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {insights.length === 0 ? (
          <div>
            <p
              className={`text-sm mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              AI-powered insights will appear here as you add more expenses.
            </p>
            <div className="space-y-2">
              <div
                className={`p-4 rounded-lg border ${
                  darkMode
                    ? 'bg-blue-900/30 border-blue-700'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex gap-3">
                  <Lightbulb
                    className={`w-5 h-5 flex-shrink-0 ${
                      darkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      darkMode ? 'text-blue-200' : 'text-blue-800'
                    }`}
                  >
                    Track your spending patterns and get personalized saving tips
                  </p>
                </div>
              </div>
              <div
                className={`p-4 rounded-lg border ${
                  darkMode
                    ? 'bg-purple-900/30 border-purple-700'
                    : 'bg-purple-50 border-purple-200'
                }`}
              >
                <div className="flex gap-3">
                  <Trophy
                    className={`w-5 h-5 flex-shrink-0 ${
                      darkMode ? 'text-purple-300' : 'text-purple-600'
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      darkMode ? 'text-purple-200' : 'text-purple-800'
                    }`}
                  >
                    Celebrate achievements when you stay within budget
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          insights.map((insight, index) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border animate-slide-in ${getColorClass(
                insight.insight_type
              )}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  {getIcon(insight.insight_type)}
                </div>
                <p className="text-sm flex-1">{insight.insight_text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
