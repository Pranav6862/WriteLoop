import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, FileText, Calendar } from 'lucide-react';

interface ContentItem {
  id: number;
  category: string;
  title: string;
  generated_text: string;
  created_at: string;
}

const ContentHistory = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await api.get('/content/');
        setContents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

  const filtered = contents.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.generated_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content History</h1>
          <p className="text-gray-500 mt-1">Review and reuse your previously generated content.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex items-center">
        <Search className="w-5 h-5 text-gray-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search contents..." 
          className="flex-1 outline-none text-gray-700 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 h-32"></div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:border-gray-300 transition-colors">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-700 text-sm whitespace-pre-wrap line-clamp-3 font-serif">
                  {item.generated_text}
                </p>
              </div>
              <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => navigator.clipboard.writeText(item.generated_text)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Copy Full Text
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No content found</h3>
          <p className="mt-1 text-gray-500">Get started by generating some new content.</p>
        </div>
      )}
    </div>
  );
};

export default ContentHistory;
