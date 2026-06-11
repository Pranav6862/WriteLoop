import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Sparkles, Copy, Check, ChevronDown } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  inputs: { name: string; label: string; type: string }[];
}

const ContentGenerator = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await api.get('/templates/');
      setTemplates(res.data);
      if (res.data.length > 0) setSelectedTemplate(res.data[0]);
    };
    fetchTemplates();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate && !inputs['prompt']) return;
    setLoading(true);
    setResult('');
    
    try {
      const payload = selectedTemplate ? {
        template_id: selectedTemplate.id,
        category: selectedTemplate.category,
        title: `${selectedTemplate.name} Output`,
        inputs
      } : {
        category: 'Custom Prompt',
        title: 'Custom Generation',
        prompt: inputs['prompt'],
        inputs: {}
      };

      const res = await api.post('/content/', payload);
      setResult(res.data.generated_text);
    } catch (err) {
      console.error(err);
      alert('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Content Generator</h1>
        <p className="text-gray-500 mt-1">Select a template and generate professional content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left column: Setup */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col h-full overflow-y-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
            <div className="relative">
              <select 
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setSelectedTemplate(null);
                    setInputs({ prompt: '' });
                  } else {
                    const tmpl = templates.find(t => t.id === parseInt(e.target.value));
                    setSelectedTemplate(tmpl || null);
                    setInputs({});
                  }
                }}
                value={selectedTemplate?.id || 'custom'}
              >
                <option value="custom">Custom Prompt</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {selectedTemplate && (
              <p className="text-xs text-gray-500 mt-2">{selectedTemplate.description}</p>
            )}
          </div>

          {selectedTemplate ? (
            <div className="flex-1 space-y-4">
              {selectedTemplate.inputs.map(input => (
                <div key={input.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{input.label}</label>
                  {input.type === 'textarea' ? (
                    <textarea 
                      rows={4}
                      value={inputs[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                    />
                  ) : (
                    <input 
                      type="text"
                      value={inputs[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What would you like to generate?</label>
                <textarea 
                  rows={8}
                  placeholder="E.g., Write a 500-word blog post about the benefits of AI in healthcare..."
                  value={inputs['prompt'] || ''}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                />
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button 
              onClick={handleGenerate}
              disabled={loading || (!selectedTemplate && !inputs['prompt'])}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Generate Content</>
              )}
            </button>
          </div>
        </div>

        {/* Right column: Result */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm p-0 flex flex-col h-full">
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
            <h3 className="font-medium text-gray-900">Output</h3>
            {result && (
              <button 
                onClick={handleCopy}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 mr-1.5 text-green-500" /> : <Copy className="w-4 h-4 mr-1.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
            )}
          </div>
          <div className="flex-1 p-5 overflow-y-auto bg-gray-50/30 font-serif text-gray-800 leading-relaxed whitespace-pre-wrap">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p>AI is thinking...</p>
              </div>
            ) : result ? (
              result
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Sparkles className="w-12 h-12 mb-3 text-gray-300" />
                <p>Fill out the fields and hit generate to see magic happen.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
