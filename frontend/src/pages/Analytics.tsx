import { useEffect, useState } from 'react';
import api from '../api/axios';
import { BarChart3, PieChart, Activity, Zap } from 'lucide-react';

interface AnalyticsData {
  total_generations: number;
  total_tokens: number;
  category_breakdown: Record<string, number>;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/analytics/');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (!data) return <div className="animate-pulse h-64 bg-gray-200 rounded-xl m-6"></div>;

  const totalBreakdown = Object.values(data.category_breakdown).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Usage Analytics</h1>
        <p className="text-gray-500 mt-1">Monitor your content generation statistics and token usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-6">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Generations</p>
            <p className="text-4xl font-bold text-gray-900">{data.total_generations}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mr-6">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Tokens Used</p>
            <p className="text-4xl font-bold text-gray-900">{data.total_tokens.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-gray-500" /> Generations by Category
        </h2>
        
        {totalBreakdown > 0 ? (
          <div className="space-y-4">
            {Object.entries(data.category_breakdown).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className="text-sm font-medium text-gray-900">{count} ({Math.round(count / totalBreakdown * 100)}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(count / totalBreakdown) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No data to display yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
