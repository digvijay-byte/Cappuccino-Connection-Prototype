import React, { useState } from 'react';
import { AppData } from '../types';
import { Search, MapPin, Filter } from 'lucide-react';

export const InventoryList: React.FC<{ data: AppData }> = ({ data }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Coffee', 'Chocolate', 'Smoothie', 'Equipment', 'Packaging']; // "Dessert" mapped to other for simplicity or kept

  const filtered = data.current_inventory.filter(item => {
      const prod = data.products.find(p => p.product_id === item.product_id);
      if (!prod) return false;

      const matchesSearch = prod.name.toLowerCase().includes(search.toLowerCase()) || prod.sku.toLowerCase().includes(search.toLowerCase());
      
      let matchesCategory = true;
      if (activeCategory !== 'All') {
          // Simple string match or custom logic
          if (activeCategory === 'Packaging') matchesCategory = prod.unit === 'pack' || prod.name.includes('Cup');
          else matchesCategory = prod.category.includes(activeCategory);
      }
      
      return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <div>
             <h2 className="text-xl font-bold text-gray-800">Inventory Management</h2>
             <p className="text-sm text-gray-500">Real-time stock levels synced with Sage MAS 100</p>
         </div>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search by SKU or Name..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
         </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto">
          {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeCategory === cat 
                    ? 'border-coffee-600 text-coffee-700' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                  {cat}
              </button>
          ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">SKU / Product</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center">Current Stock</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center text-indigo-600">Forecast (30d)</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center">Rec. Re-order</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filtered.map(item => {
                    const prod = data.products.find(p => p.product_id === item.product_id)!;
                    const prediction = data.prediction_output.find(p => p.product_id === item.product_id);
                    const isLow = item.current_stock <= prod.reorder_level;
                    
                    return (
                        <tr key={item.product_id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                                <div className="font-medium text-gray-800">{prod.name}</div>
                                <div className="text-xs text-gray-500 font-mono">{prod.sku} • {prod.category}</div>
                            </td>
                            <td className="p-4 text-center">
                                <span className="font-bold text-gray-700">{item.current_stock}</span> <span className="text-xs text-gray-400">{prod.unit}</span>
                            </td>
                            <td className="p-4 text-center bg-indigo-50/30">
                                <span className="font-bold text-indigo-700">{prediction?.predicted_usage_next_30_days || '-'}</span>
                            </td>
                            <td className="p-4 text-center">
                                {prediction && prediction.recommended_restock_qty > 0 ? (
                                    <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">
                                        +{prediction.recommended_restock_qty}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 text-sm">-</span>
                                )}
                            </td>
                            <td className="p-4">
                                {isLow ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Low Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        OK
                                    </span>
                                )}
                                <div className="text-xs text-gray-400 mt-1 flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" /> {item.warehouse_location}
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500">No products found for this category/search.</div>
        )}
      </div>
    </div>
  );
};