import React, { useState, useEffect } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import DashboardView from './components/DashboardView';
import HistoryAnalyticsView from './components/HistoryAnalyticsView';
import { LayoutDashboard, History, Sun, Moon } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'history'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-0 sm:p-4 transition-colors duration-300">
        {/* Mobile mock container */}
        <div className={`w-full max-w-md min-h-screen sm:min-h-[820px] sm:max-h-[820px] flex flex-col relative overflow-hidden pb-28 border transition-all duration-300 sm:rounded-3xl shadow-2xl ${
          isDarkMode 
            ? 'bg-[#1A1C23] text-slate-100 border-[#2C303D] shadow-slate-950/50' 
            : 'bg-slate-50 text-slate-800 border-slate-100'
        } ${isDarkMode ? 'dark' : ''}`}>
          
          {/* Top Header */}
          <header className="bg-white/80 dark:bg-[#1A1C23]/80 backdrop-blur-md border-b border-slate-100 dark:border-[#2C303D] px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-10 select-none transition-colors duration-300">
            <div>
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                WhoseTreat? 🍰
              </h1>
            </div>
            
            {/* Visual pulse & Dark Mode Toggle */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-[#222530] transition-all duration-200 active:scale-95 cursor-pointer"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
              </button>

              <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 px-2 py-0.5 rounded-full transition-colors duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase select-none">Synced</span>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-slate-50/30 dark:bg-[#1A1C23]/10">
            {activeView === 'dashboard' ? (
              <DashboardView />
            ) : (
              <HistoryAnalyticsView />
            )}
          </main>

          {/* Premium Bottom Tab Bar */}
          <nav className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-[#222530]/90 backdrop-blur-md border border-slate-100 dark:border-[#2C303D] rounded-2xl shadow-lg dark:shadow-slate-950/20 p-2 flex items-center justify-around z-20 transition-all duration-300">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-300 ${
                activeView === 'dashboard'
                  ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#2A2E3D] dark:to-[#222530] text-slate-800 dark:text-slate-100 shadow-xs scale-100 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400 font-medium active:scale-95'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 transition-transform duration-300 ${activeView === 'dashboard' ? 'scale-110 text-emerald-500' : ''}`} />
              <span className="text-[10px] tracking-wide">Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveView('history')}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-300 ${
                activeView === 'history'
                  ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#2A2E3D] dark:to-[#222530] text-slate-800 dark:text-slate-100 shadow-xs scale-100 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400 font-medium active:scale-95'
              }`}
            >
              <History className={`w-5 h-5 transition-transform duration-300 ${activeView === 'history' ? 'scale-110 text-emerald-500' : ''}`} />
              <span className="text-[10px] tracking-wide">History</span>
            </button>
          </nav>
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default App;