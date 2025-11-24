import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PredictionsView } from './components/PredictionsView';
import { InventoryList } from './components/InventoryList';
import { AccountingView } from './components/AccountingView';
import { ImportView } from './components/ImportView';
import { AiAssistant } from './components/AiAssistant';
import { generateMockData } from './utils/dataGenerator';
import { AppData, ViewState } from './types';
import { TrendingUp, FileText, Download } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid } from 'recharts';

const SalesView: React.FC<{ data: AppData }> = ({ data }) => {
    // Process data for chart
    const dailySales = data.sales_history.reduce((acc: any[], curr) => {
        const found = acc.find(a => a.date === curr.date);
        const prod = data.products.find(p => p.product_id === curr.product_id);
        const val = curr.quantity_used_or_sold * (prod?.selling_price || 0);
        if(found) { found.total += val; } 
        else { acc.push({ date: curr.date, total: val }); }
        return acc;
    }, []).reverse();

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Sales History</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailySales}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tick={{fontSize: 12}} minTickGap={30} />
                        <YAxis tickFormatter={(val) => `$${val}`} />
                        <ChartTooltip formatter={(val) => [`$${val}`, 'Sales']} />
                        <Line type="monotone" dataKey="total" stroke="#8a6250" strokeWidth={3} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-xs text-gray-500 uppercase">Date</th>
                            <th className="p-4 text-xs text-gray-500 uppercase">Transaction ID</th>
                            <th className="p-4 text-xs text-gray-500 uppercase">Product</th>
                            <th className="p-4 text-xs text-gray-500 uppercase">Qty</th>
                            <th className="p-4 text-xs text-gray-500 uppercase">Event</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.sales_history.slice(0, 50).map((sale, i) => { // Limit for render perf
                            const prod = data.products.find(p => p.product_id === sale.product_id);
                            return (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-600">{sale.date}</td>
                                    <td className="p-4 text-xs font-mono text-gray-400">{sale.transaction_id}</td>
                                    <td className="p-4 text-sm font-medium">{prod?.name}</td>
                                    <td className="p-4 text-sm">{sale.quantity_used_or_sold}</td>
                                    <td className="p-4 text-sm text-blue-600">{sale.event_name || '-'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const loadData = () => {
        const generated = generateMockData();
        setData(generated);
    };
    loadData();
  }, []);

  if (!data) return <div className="h-screen flex items-center justify-center bg-gray-50 text-coffee-600">Loading Cappuccino Connection v2...</div>;

  return (
    <Layout currentView={view} onNavigate={setView}>
      {view === ViewState.DASHBOARD && <Dashboard data={data} onNavigate={setView} />}
      {view === ViewState.SMART_RESTOCK && <PredictionsView data={data} />}
      {view === ViewState.INVENTORY && <InventoryList data={data} />}
      {view === ViewState.SALES && <SalesView data={data} />}
      {view === ViewState.ACCOUNTING && <AccountingView data={data} onUpdateData={setData} />}
      {view === ViewState.IMPORT && <ImportView />}
      
      {/* Floating AI Assistant available on all screens */}
      <AiAssistant data={data} />
    </Layout>
  );
}

export default App;