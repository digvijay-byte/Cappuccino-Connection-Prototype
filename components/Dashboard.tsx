import React from 'react';
import { AppData, ViewState } from '../types';
import { AlertTriangle, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardProps {
  data: AppData;
  onNavigate?: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onNavigate }) => {
  // Calculate Key Metrics
  const restockNeededItems = data.prediction_output.filter(p => p.recommended_restock_qty > 0);
  const highRiskItems = data.prediction_output.filter(p => p.stock_out_risk === 'High');
  
  // Chart Data
  const chartData = [];
  const today = new Date();
  for(let i=13; i>=0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dailyTotal = data.sales_history
        .filter(s => s.date === dStr)
        .reduce((acc, sale) => {
            const prod = data.products.find(p => p.product_id === sale.product_id);
            return acc + (sale.quantity_used_or_sold * (prod?.selling_price || 0));
        }, 0);
      chartData.push({ name: dStr.slice(5), value: dailyTotal });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Restock Recommendations Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="z-10 relative">
             <div className="flex items-center space-x-2 text-red-600 mb-2">
               <AlertTriangle className="w-5 h-5" />
               <span className="font-bold text-sm uppercase tracking-wide">Restock Alert</span>
             </div>
             <h3 className="text-3xl font-bold text-gray-900 mb-1">{restockNeededItems.length} Items</h3>
             <p className="text-gray-500 mb-4">require re-order this week</p>
             <button 
                onClick={() => onNavigate?.(ViewState.SMART_RESTOCK)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center group"
             >
               View Suggested Order List
               <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>

        {/* Seasonal Demand Alert */}
        <div className="bg-indigo-600 rounded-xl shadow-sm border border-indigo-500 p-6 text-white relative overflow-hidden">
           <div className="absolute -right-6 -bottom-6 text-indigo-500 opacity-20">
              <TrendingUp className="w-40 h-40" />
           </div>
           <div className="relative z-10">
              <div className="flex items-center space-x-2 text-indigo-200 mb-2">
                 <TrendingUp className="w-5 h-5" />
                 <span className="font-bold text-sm uppercase tracking-wide">Seasonal Forecast</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Demand rising 32%</h3>
              <p className="text-indigo-100 mb-6">Upcoming Holiday Season impact detected. 4 Chocolate category items strongly affected.</p>
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-indigo-600 flex items-center justify-center text-xs font-bold">
                       {i}
                    </div>
                 ))}
                 <span className="ml-4 text-sm text-indigo-200 self-center">Review Impact</span>
              </div>
           </div>
        </div>

        {/* Revenue Mini Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Revenue Trend</h3>
             <div className="flex-1 min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8a6250" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8a6250" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#8a6250" strokeWidth={2} fill="url(#colorRev)" />
                </AreaChart>
                </ResponsiveContainer>
             </div>
             <p className="text-center text-sm text-gray-400 mt-2">Last 14 Days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock-Out Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                 <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                 Stock-Out Timeline & Order Calendar
              </h3>
              <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                Action Required
              </span>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-100">
                 <tr>
                   <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Item</th>
                   <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Est. Stock-Out</th>
                   <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Recommended Order By</th>
                   <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {restockNeededItems.slice(0, 5).map(p => {
                    const prod = data.products.find(prod => prod.product_id === p.product_id);
                    const daysLeft = Math.floor(p.current_stock / p.avg_daily_usage);
                    
                    const stockOutDate = new Date();
                    stockOutDate.setDate(today.getDate() + daysLeft);
                    
                    const orderDate = new Date(stockOutDate);
                    orderDate.setDate(stockOutDate.getDate() - 7); // Lead time buffer

                    const isUrgent = daysLeft < 7;

                    return (
                       <tr key={p.product_id} className="hover:bg-gray-50">
                          <td className="p-3 font-medium text-gray-800">{prod?.name}</td>
                          <td className="p-3 text-sm text-gray-600">
                             {stockOutDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                             <span className="text-xs text-gray-400 ml-1">({daysLeft} days)</span>
                          </td>
                          <td className="p-3 text-sm font-semibold text-coffee-700">
                             {orderDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                          </td>
                          <td className="p-3">
                             {isUrgent ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Urgent
                                </span>
                             ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  Plan Soon
                                </span>
                             )}
                          </td>
                       </tr>
                    )
                 })}
                 {restockNeededItems.length === 0 && (
                     <tr>
                         <td colSpan={4} className="p-8 text-center text-gray-400">All stock levels look healthy. No immediate orders needed.</td>
                     </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        {/* Quick Links / Summary */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
           <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">System Status</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                 <span className="text-sm text-gray-600">Accounting Sync</span>
                 <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Connected</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                 <span className="text-sm text-gray-600">Pending Orders</span>
                 <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">0 Active</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                 <span className="text-sm text-gray-600">Last Forecast</span>
                 <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">Just now</span>
              </div>
           </div>
           
           <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Needs Attention</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>{highRiskItems.length} Critical low stock items</li>
                  <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></div>Weekend event surge expected</li>
              </ul>
           </div>
        </div>

      </div>
    </div>
  );
};