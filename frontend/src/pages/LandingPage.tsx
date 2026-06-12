import { Link } from 'react-router-dom';
import { PenTool, Zap, BarChart3, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <PenTool className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight">WriteLoop</span>
            </div>
            <div className="flex gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2">Log in</Link>
              <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-4 py-2 rounded-lg transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl mb-6">
              Create professional content in <span className="text-blue-600">seconds</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10">
              The all-in-one AI platform for generating blogs, emails, marketing copy, and social media posts. Boost your productivity today.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                Start Generating <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-500">Generate high-quality content in seconds, not hours. Our advanced AI models are optimized for speed.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Templates</h3>
              <p className="text-gray-500">From blogs to tweets, we have professional templates designed for every content need.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Usage Analytics</h3>
              <p className="text-gray-500">Track your content generation history and monitor token usage in our comprehensive dashboard.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
