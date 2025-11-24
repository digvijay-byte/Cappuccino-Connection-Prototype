import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, RefreshCw, ArrowRight, Check } from 'lucide-react';

export const ImportView: React.FC = () => {
    const [step, setStep] = useState(1);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            alert("Successfully synced 124 records from Sage MAS 100.");
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Import & Synchronization</h2>
                <p className="text-gray-500">Connect your accounting software or upload manual records.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Manual CSV Upload */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-coffee-400 transition-colors cursor-pointer group">
                    <div className="p-4 bg-gray-50 rounded-full mb-4 group-hover:bg-coffee-50 transition-colors">
                        <FileSpreadsheet className="w-10 h-10 text-gray-400 group-hover:text-coffee-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Upload CSV</h3>
                    <p className="text-sm text-gray-500 mb-6">Import inventory or sales data from spreadsheet.</p>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 w-full">
                        Select File
                    </button>
                </div>

                {/* Sage Sync */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                    <div className="p-4 bg-green-50 rounded-full mb-4">
                        <RefreshCw className={`w-10 h-10 text-green-600 ${isSyncing ? 'animate-spin' : ''}`} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Sage MAS 100</h3>
                    <p className="text-sm text-gray-500 mb-6">Direct connection active. Last sync: 14 mins ago.</p>
                    <button 
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 w-full flex items-center justify-center"
                    >
                        {isSyncing ? 'Syncing...' : 'Sync Now'}
                    </button>
                </div>
            </div>

            {/* Field Mapping Mockup */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-100 pb-4 mb-4">
                    <h3 className="font-bold text-gray-800">Field Mapping Configuration</h3>
                    <p className="text-xs text-gray-500">Map your Sage MAS 100 fields to Cappuccino Connection fields.</p>
                </div>
                
                <div className="space-y-3">
                    <div className="grid grid-cols-7 gap-4 items-center text-sm">
                        <div className="col-span-3 p-3 bg-gray-50 rounded border border-gray-200 text-gray-600 font-mono">Sage: ItemDesc</div>
                        <div className="col-span-1 flex justify-center"><ArrowRight className="w-4 h-4 text-gray-400" /></div>
                        <div className="col-span-3 p-3 bg-blue-50 rounded border border-blue-100 text-blue-800 font-medium flex justify-between items-center">
                            Product Name
                            <Check className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-4 items-center text-sm">
                        <div className="col-span-3 p-3 bg-gray-50 rounded border border-gray-200 text-gray-600 font-mono">Sage: QtyOnHand</div>
                        <div className="col-span-1 flex justify-center"><ArrowRight className="w-4 h-4 text-gray-400" /></div>
                        <div className="col-span-3 p-3 bg-blue-50 rounded border border-blue-100 text-blue-800 font-medium flex justify-between items-center">
                            Current Stock
                            <Check className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-4 items-center text-sm">
                        <div className="col-span-3 p-3 bg-gray-50 rounded border border-gray-200 text-gray-600 font-mono">Sage: UnitCost</div>
                        <div className="col-span-1 flex justify-center"><ArrowRight className="w-4 h-4 text-gray-400" /></div>
                        <div className="col-span-3 p-3 bg-blue-50 rounded border border-blue-100 text-blue-800 font-medium flex justify-between items-center">
                            Cost Price
                            <Check className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                    <button className="text-coffee-600 font-medium text-sm hover:underline">Advanced Mapping Options</button>
                </div>
            </div>
        </div>
    );
};