import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { PenTool, Zap, Activity, Clock } from 'lucide-react';

interface Analytics {
  total_generations: number;
  total_tokens: number;
  recent_activity: any[];
}

const Dashboard = () => {
  const [data, setData] = useState<Analytics | null>(null);

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

  if (!data) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-gray-200 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-gray-200 rounded col-span-2"></div><div className="h-2 bg-gray-200 rounded col-span-1"></div></div><div className="h-2 bg-gray-200 rounded"></div></div></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your content overview.</p>
        </div>
        <Link to="/app/generate" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <PenTool className="w-4 h-4" /> New Content
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500">Total Generations</h3>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.total_generations}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500">Tokens Used</h3>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.total_tokens}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
          <h3 className="font-medium text-gray-900 mb-2">Need more capacity?</h3>
          <button className="text-blue-600 font-medium hover:text-blue-700">Upgrade Plan</button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" /> Recent Generations
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {data.recent_activity.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {data.recent_activity.map((item) => (
                <li key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.generated_text}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No content generated yet. <Link to="/app/generate" className="text-blue-600 hover:underline">Start generating</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
