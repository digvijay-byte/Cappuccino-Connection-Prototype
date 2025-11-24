import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Package, TrendingUp, DollarSign, BrainCircuit, Coffee, UploadCloud, Calculator } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: ViewState.INVENTORY, label: 'Inventory', icon: Package },
    { view: ViewState.SMART_RESTOCK, label: 'Smart Restock Suggestions', icon: BrainCircuit },
    { view: ViewState.ACCOUNTING, label: 'Accounting', icon: Calculator },
    { view: ViewState.SALES, label: 'Sales History', icon: TrendingUp },
    { view: ViewState.IMPORT, label: 'Import / Sync', icon: UploadCloud },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-coffee-900 text-coffee-50 flex flex-col shadow-xl z-20">
        <div className="p-6 flex items-center space-x-3 border-b border-coffee-800">
          <div className="bg-coffee-500 p-2 rounded-lg">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg leading-tight">Cappuccino<br/>Connection</span>
        </div>
        
        <nav className="flex-1 py-6 space-y-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === item.view 
                  ? 'bg-coffee-700 text-white shadow-md transform scale-[1.02]' 
                  : 'text-coffee-200 hover:bg-coffee-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-coffee-800 text-xs text-coffee-400 text-center">
          v2.1.0 • Connected to Sage MAS 100
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 z-10">
           <h1 className="text-xl font-bold text-gray-800">
             {navItems.find(n => n.view === currentView)?.label}
           </h1>
           <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2 text-sm text-gray-500">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span>Sage Sync Active</span>
             </div>
             <div className="h-8 w-8 rounded-full bg-coffee-200 border border-coffee-400 flex items-center justify-center text-coffee-800 font-bold">
               JS
             </div>
           </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};