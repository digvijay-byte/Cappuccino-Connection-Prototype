import React from 'react';
import { AppData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Info, BrainCircuit } from 'lucide-react';

interface PredictionsViewProps {
  data: AppData;
}

export const PredictionsView: React.FC<PredictionsViewProps> = ({ data }) => {
  
  const chartData = data.prediction_output.map(p => {
    const prod = data.products.find(prod => prod.product_id === p.product_id);
    return {
      name: prod?.name.split(' ').slice(0, 2).join(' ') + '...', // Short name
      fullName: prod?.name,
      current: p.current_stock,
      predicted30: p.predicted_usage_next_30_days,
      risk: p.stock_out_risk
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 text-white shadow-lg flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
                <BrainCircuit className="w-8 h-8 mr-3 opacity-80" />
                Smart Restock Suggestions
            </h2>
            <p className="opacity-90 max-w-2xl">
            AI-driven analysis of your sales history, seasonality, and consumption rates.
            </p>
        </div>
        <div className="hidden md:block bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Forecast Model</span>
            <div className="font-bold text-lg">Gemini 2.5 Flash</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Stock vs. 30-Day Predicted Demand</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={80} tick={{fontSize: 11}} />
              <YAxis />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                        <p className="font-bold text-gray-800 mb-2">{data.fullName}</p>
                        <p className="text-sm text-blue-600">Current Stock: {data.current}</p>
                        <p className="text-sm text-purple-600">Predicted Demand (30d): {data.predicted30}</p>
                        <p className={`text-xs mt-2 font-bold ${data.risk === 'High' ? 'text-red-500' : 'text-green-500'}`}>Risk Level: {data.risk}</p>
                        </div>
                    );
                    }
                    return null;
                }}
              />
              <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}} />
              <Bar name="Current Stock" dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar name="Predicted Demand (30d)" dataKey="predicted30" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4">
         <h3 className="text-lg font-bold text-gray-800 mt-4">Restock Action List</h3>
         <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Stock Risk</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Current Stock</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-purple-700">Predicted (30d)</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-red-600">Recommended Order</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase">AI Insight</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.prediction_output.map(p => {
                        const product = data.products.find(prod => prod.product_id === p.product_id);
                        return (
                            <tr key={p.product_id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-800">{product?.name}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        p.stock_out_risk === 'High' ? 'bg-red-100 text-red-800' :
                                        p.stock_out_risk === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {p.stock_out_risk}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600 font-mono">{p.current_stock}</td>
                                <td className="p-4 text-purple-700 font-bold bg-purple-50/50">{p.predicted_usage_next_30_days}</td>
                                <td className="p-4">
                                    {p.recommended_restock_qty > 0 ? (
                                        <div className="flex items-center text-red-600 font-bold bg-red-50 p-2 rounded w-fit">
                                            <AlertTriangle className="w-4 h-4 mr-1" />
                                            {p.recommended_restock_qty} {product?.unit}
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-gray-400 text-sm">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            OK
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-gray-500 italic max-w-xs truncate">"{p.comment}"</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};