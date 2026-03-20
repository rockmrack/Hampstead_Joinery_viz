import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  Paintbrush, 
  Calculator, 
  Users, 
  MessageSquare, 
  Settings, 
  ChevronRight, 
  Home, 
  Camera, 
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  Upload,
  Sparkles,
  Loader2,
  Hammer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { visualizeRenovation } from './services/geminiService';
import { Estimator } from './components/Estimator';
import { JoineryConfigurator } from './components/JoineryConfigurator';
import { ErrorBoundary } from './components/ErrorBoundary';

const TOOLS = [
  {
    id: 'joinery',
    name: 'Bespoke Joinery',
    description: 'Configure custom cabinetry with 3D visualization and AI advice.',
    icon: Hammer,
    color: 'bg-zinc-900',
    status: 'New'
  },
  {
    id: 'visualizer',
    name: 'AI Design Visualizer',
    description: 'Upload room photos and instantly visualize renovations with AI.',
    icon: Paintbrush,
    color: 'bg-indigo-500',
    status: 'Ready'
  },
  {
    id: 'estimator',
    name: 'Smart Quote Estimator',
    description: 'Generate London-market accurate renovation estimates in seconds.',
    icon: Calculator,
    color: 'bg-emerald-500',
    status: 'Beta'
  },
  {
    id: 'portal',
    name: 'Client Progress Portal',
    description: 'Manage project timelines, photo updates, and client sign-offs.',
    icon: Users,
    color: 'bg-amber-500',
    status: 'Ready'
  },
  {
    id: 'qualifier',
    name: 'AI Lead Qualifier',
    description: 'Automated lead capture and qualification for high-value projects.',
    icon: MessageSquare,
    color: 'bg-rose-500',
    status: 'Ready'
  }
];

const STYLES = [
  'Modern Minimalist',
  'Industrial Loft',
  'Classic Victorian',
  'Scandinavian',
  'Luxury Art Deco',
  'Mid-Century Modern'
];

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const Visualizer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [style, setStyle] = useState(STYLES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; generatedImageUrl: string | null } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVisualize = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const mimeType = image.split(';')[0].split(':')[1];
      const base64 = image.split(',')[1];
      const data = await visualizeRenovation(base64, style, mimeType);
      setResult(data || { text: 'No response from AI.', generatedImageUrl: null });
    } catch (error) {
      console.error(error);
      setResult({ text: 'Error generating visualization. Please try again.', generatedImageUrl: null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8">
          <h3 className="text-xl font-semibold mb-6">1. Upload Room Photo</h3>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4 overflow-hidden relative ${
              image ? 'border-zinc-900' : 'border-zinc-200 hover:border-zinc-400 bg-zinc-50'
            }`}
          >
            {image ? (
              <img src={image} alt="Upload" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400">
                  <Upload size={20} />
                </div>
                <p className="text-sm text-zinc-500 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-zinc-400">JPG, PNG up to 10MB</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl p-8">
          <h3 className="text-xl font-semibold mb-6">2. Select Style</h3>
          <div className="grid grid-cols-2 gap-3">
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  style === s 
                    ? 'bg-zinc-900 text-white shadow-lg' 
                    : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={handleVisualize}
            disabled={!image || loading}
            className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? 'Re-imagining...' : 'Generate Visualization'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl p-8 min-h-[500px] flex flex-col">
        <h3 className="text-xl font-semibold mb-6">AI Design Proposal</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 border-4 border-zinc-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                <p className="text-zinc-500 font-medium italic">Gemini is analyzing your space...</p>
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-left space-y-6"
              >
                {result.generatedImageUrl && (
                  <div className="aspect-video rounded-2xl overflow-hidden border border-zinc-200 shadow-lg">
                    <img 
                      src={result.generatedImageUrl} 
                      alt="Renovated Visualization" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="prose prose-zinc prose-sm max-w-none">
                  <div className="markdown-body">
                    <Markdown>{result.text}</Markdown>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 mx-auto">
                  <Paintbrush size={32} />
                </div>
                <p className="text-zinc-400 max-w-xs mx-auto">
                  Upload a photo and select a style to generate your AI-powered design proposal.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('joinery');

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <Home className="text-white" size={18} />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Hampstead</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Hammer} 
            label="Joinery Config" 
            active={activeTab === 'joinery'} 
            onClick={() => setActiveTab('joinery')} 
          />
          <SidebarItem 
            icon={Paintbrush} 
            label="Visualizer" 
            active={activeTab === 'visualizer'} 
            onClick={() => setActiveTab('visualizer')} 
          />
          <SidebarItem 
            icon={Calculator} 
            label="Estimator" 
            active={activeTab === 'estimator'} 
            onClick={() => setActiveTab('estimator')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Client Portal" 
            active={activeTab === 'portal'} 
            onClick={() => setActiveTab('portal')} 
          />
          <SidebarItem 
            icon={MessageSquare} 
            label="Lead Qualifier" 
            active={activeTab === 'qualifier'} 
            onClick={() => setActiveTab('qualifier')} 
          />
        </nav>

        <div className="pt-6 border-t border-zinc-100">
          <SidebarItem icon={Settings} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-zinc-500">Welcome back, Ross</h2>
            <p className="font-semibold text-zinc-900">Hampstead Renovations Suite</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
              <Plus size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
              <img 
                src="https://picsum.photos/seed/ross/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[320px]">
                    <div className="relative z-10">
                      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 block">New Feature</span>
                      <h3 className="text-4xl font-light leading-tight mb-4">
                        Visualize the <span className="italic font-serif">future</span> of any room in seconds.
                      </h3>
                      <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
                        Our new AI Design Visualizer is now available. Help your clients see the potential of their London property before the first brick is moved.
                      </p>
                    </div>
                    <div className="relative z-10 flex gap-4">
                      <button 
                        onClick={() => setActiveTab('visualizer')}
                        className="bg-white text-zinc-900 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-zinc-100 transition-colors"
                      >
                        Try Visualizer
                      </button>
                      <button className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-zinc-700 transition-colors">
                        Learn More
                      </button>
                    </div>
                    {/* Abstract background element */}
                    <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
                    <div className="absolute right-10 top-10 opacity-20">
                      <Paintbrush size={120} strokeWidth={1} />
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-zinc-900 mb-2">Active Projects</h4>
                      <div className="space-y-4 mt-6">
                        {[
                          { name: 'Chelsea Loft', progress: 75, status: 'Plastering' },
                          { name: 'Islington Kitchen', progress: 30, status: 'Demolition' },
                          { name: 'Richmond Suite', progress: 95, status: 'Final Fix' }
                        ].map((project, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-zinc-700">{project.name}</span>
                              <span className="text-zinc-400">{project.status}</span>
                            </div>
                            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-zinc-900 rounded-full" 
                                style={{ width: `${project.progress}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors">
                      View all projects <ChevronRight size={16} />
                    </button>
                  </div>
                </section>

                {/* Tools Grid */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-zinc-900">AI-Powered Suite</h3>
                    <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900">Manage Tools</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TOOLS.map((tool) => (
                      <motion.div
                        key={tool.id}
                        whileHover={{ y: -4 }}
                        onClick={() => setActiveTab(tool.id)}
                        className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-zinc-200/50 transition-all cursor-pointer group"
                      >
                        <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                          <tool.icon size={24} />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-zinc-900">{tool.name}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            tool.status === 'Ready' ? 'bg-zinc-100 text-zinc-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {tool.status}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          {tool.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Recent Activity */}
                <section className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">
                  <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900">Recent Activity</h3>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        <TrendingUp size={12} /> +12% this week
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-zinc-50">
                    {[
                      { icon: Camera, text: 'New photo update uploaded for Chelsea Loft', time: '2 hours ago', user: 'Site Manager' },
                      { icon: CheckCircle2, text: 'Richmond Suite final fix sign-off received', time: '5 hours ago', user: 'Client' },
                      { icon: Clock, text: 'New lead qualified: 4-bed extension in Hampstead', time: '1 day ago', user: 'AI Qualifier' },
                    ].map((item, i) => (
                      <div key={i} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                            <item.icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-900">{item.text}</p>
                            <p className="text-xs text-zinc-400">{item.user} • {item.time}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-zinc-300" />
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'joinery' && (
              <motion.div
                key="joinery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900">Bespoke Joinery Configurator</h2>
                    <p className="text-zinc-500">Design custom cabinetry with real-time 3D and AI expertise.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
                  >
                    Back to Dashboard
                  </button>
                </div>
                <ErrorBoundary>
                  <JoineryConfigurator />
                </ErrorBoundary>
              </motion.div>
            )}

            {activeTab === 'visualizer' && (
              <motion.div
                key="visualizer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900">AI Design Visualizer</h2>
                    <p className="text-zinc-500">Re-imagine your space with high-end London aesthetics.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
                  >
                    Back to Dashboard
                  </button>
                </div>
                <Visualizer />
              </motion.div>
            )}

            {activeTab === 'estimator' && (
              <motion.div
                key="estimator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900">Smart Quote Estimator</h2>
                    <p className="text-zinc-500">Get an instant, London-market accurate estimate for your project.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
                  >
                    Back to Dashboard
                  </button>
                </div>
                <Estimator />
              </motion.div>
            )}

            {activeTab !== 'dashboard' && activeTab !== 'visualizer' && activeTab !== 'estimator' && activeTab !== 'joinery' && (
              <motion.div
                key="other"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-6">
                  <Plus size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-zinc-900 mb-2">
                  {TOOLS.find(t => t.id === activeTab)?.name || 'Module'}
                </h3>
                <p className="text-zinc-500 max-w-md">
                  This module is being integrated into your suite. Would you like me to build the full functional version of this tool now?
                </p>
                <button className="mt-8 bg-zinc-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-colors">
                  Build Module
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
