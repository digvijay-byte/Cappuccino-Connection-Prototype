import React, { useState } from 'react';
import { AppData, PurchaseOrder, PurchaseOrderLineItem } from '../types';
import { FileText, Download, CheckCircle, Clock, AlertCircle, Printer, Filter, Plus, ShoppingCart, Trash2, X, Save } from 'lucide-react';

interface AccountingViewProps {
    data: AppData;
    onUpdateData?: (newData: AppData) => void;
}

export const AccountingView: React.FC<AccountingViewProps> = ({ data, onUpdateData }) => {
    const [activeTab, setActiveTab] = useState<'invoices' | 'purchase_orders'>('invoices');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Pending' | 'Overdue' | 'Draft' | 'Sent'>('All');
    
    // Purchase Order Modal State
    const [isPOModalOpen, setIsPOModalOpen] = useState(false);
    const [newPO, setNewPO] = useState<{
        supplier: string;
        order_date: string;
        expected_delivery: string;
        line_items: PurchaseOrderLineItem[];
    }>({
        supplier: '',
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery: '',
        line_items: []
    });

    const suppliers = Array.from(new Set(data.products.map(p => p.supplier)));

    // --- Computed Values ---

    const filteredInvoices = data.invoices.filter(inv => 
        filterStatus === 'All' ? true : inv.status === filterStatus
    ).sort((a, b) => new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime());

    const filteredPOs = (data.purchase_orders || []).filter(po => 
        filterStatus === 'All' ? true : po.status === filterStatus
    ).sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());

    const totalPaid = data.invoices.filter(i => i.status === 'Paid').reduce((acc, c) => acc + c.total_amount, 0);
    const totalPending = data.invoices.filter(i => i.status === 'Pending').reduce((acc, c) => acc + c.total_amount, 0);
    const totalOverdue = data.invoices.filter(i => i.status === 'Overdue').reduce((acc, c) => acc + c.total_amount, 0);

    // --- Actions ---

    const handleGenerateInvoicePDF = (invoiceId: string) => {
        const inv = data.invoices.find(i => i.invoice_id === invoiceId);
        if(!inv) return;
        const html = `
            <html><head><title>Invoice ${inv.invoice_id}</title>
            <style>body{font-family:'Helvetica',sans-serif;padding:40px;color:#333}.header{display:flex;justify-content:space-between;border-bottom:2px solid #ddd;padding-bottom:20px;margin-bottom:30px}.logo{font-size:24px;font-weight:bold;color:#8a6250}.invoice-details{text-align:right}.status{font-weight:bold;text-transform:uppercase;color:${inv.status === 'Paid' ? 'green' : (inv.status === 'Overdue' ? 'red' : 'orange')}}table{width:100%;border-collapse:collapse;margin-top:20px}th{text-align:left;border-bottom:1px solid #ddd;padding:10px 0}td{padding:10px 0;border-bottom:1px solid #eee}.total{font-size:18px;font-weight:bold;text-align:right;margin-top:30px}.footer{margin-top:50px;font-size:12px;color:#777;text-align:center;border-top:1px solid #eee;padding-top:20px}</style>
            </head><body><div class="header"><div><div class="logo">The Cappuccino Connection</div><p>123 Coffee Lane, Atlanta, GA</p></div><div class="invoice-details"><h1>INVOICE</h1><p><strong>ID:</strong> ${inv.invoice_id}</p><p><strong>Date:</strong> ${inv.invoice_date}</p><p><strong>Due:</strong> ${inv.due_date}</p><p class="status">${inv.status}</p></div></div><h3>Bill To:</h3><p><strong>${inv.customer_name}</strong></p><table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th style="text-align:right">Total</th></tr></thead><tbody>
            ${inv.line_items.map(item => {const prod = data.products.find(p => p.product_id === item.product_id);return `<tr><td>${prod?.name || item.product_id}</td><td>${item.quantity}</td><td>$${item.unit_price.toFixed(2)}</td><td style="text-align:right">$${item.line_total.toFixed(2)}</td></tr>`;}).join('')}
            </tbody></table><div class="total">Total Amount: $${inv.total_amount.toFixed(2)}</div><div class="footer">Thank you for your business!</div><script>window.print();</script></body></html>
        `;
        const printWindow = window.open('', '_blank', 'width=800,height=800');
        printWindow?.document.write(html);
        printWindow?.document.close();
    };

    const handlePrintPO = (po: PurchaseOrder) => {
        const html = `
            <html><head><title>PO ${po.po_id}</title>
            <style>body{font-family:'Helvetica',sans-serif;padding:40px;color:#333}.header{display:flex;justify-content:space-between;border-bottom:2px solid #333;padding-bottom:20px;margin-bottom:30px}.logo{font-size:24px;font-weight:bold;color:#8a6250}.details{text-align:right}table{width:100%;border-collapse:collapse;margin-top:20px}th{text-align:left;border-bottom:1px solid #000;padding:10px 0}td{padding:10px 0;border-bottom:1px solid #eee}.total{font-size:18px;font-weight:bold;text-align:right;margin-top:30px}.footer{margin-top:50px;font-size:12px;color:#777;text-align:center;border-top:1px solid #eee;padding-top:20px}</style>
            </head><body><div class="header"><div><div class="logo">The Cappuccino Connection</div><p>123 Coffee Lane, Atlanta, GA</p></div><div class="details"><h1>PURCHASE ORDER</h1><p><strong>PO #:</strong> ${po.po_id}</p><p><strong>Date:</strong> ${po.order_date}</p><p><strong>Status:</strong> ${po.status}</p></div></div>
            <div style="margin-bottom: 30px;"><h3>Vendor:</h3><p><strong>${po.supplier}</strong></p></div>
            <table><thead><tr><th>Product</th><th>Quantity</th><th>Unit Cost</th><th style="text-align:right">Total</th></tr></thead><tbody>
            ${po.line_items.map(item => {const prod = data.products.find(p => p.product_id === item.product_id);return `<tr><td>${prod?.name || item.product_id}</td><td>${item.quantity}</td><td>$${item.unit_cost.toFixed(2)}</td><td style="text-align:right">$${item.line_total.toFixed(2)}</td></tr>`;}).join('')}
            </tbody></table><div class="total">Order Total: $${po.total_amount.toFixed(2)}</div><div class="footer">Generated by Cappuccino Connection Inventory Assistant</div><script>window.print();</script></body></html>
        `;
        const printWindow = window.open('', '_blank', 'width=800,height=800');
        printWindow?.document.write(html);
        printWindow?.document.close();
    };

    const addPOLineItem = () => {
        setNewPO({
            ...newPO,
            line_items: [...newPO.line_items, { product_id: '', quantity: 1, unit_cost: 0, line_total: 0 }]
        });
    };

    const updatePOLineItem = (index: number, field: keyof PurchaseOrderLineItem, value: any) => {
        const updatedItems = [...newPO.line_items];
        const item = { ...updatedItems[index] };

        if (field === 'product_id') {
            const product = data.products.find(p => p.product_id === value);
            item.product_id = value;
            item.unit_cost = product ? product.cost_price : 0;
            item.line_total = item.quantity * item.unit_cost;
        } else if (field === 'quantity') {
            item.quantity = Number(value);
            item.line_total = item.quantity * item.unit_cost;
        } else if (field === 'unit_cost') {
            item.unit_cost = Number(value);
            item.line_total = item.quantity * item.unit_cost;
        }

        updatedItems[index] = item;
        setNewPO({ ...newPO, line_items: updatedItems });
    };

    const removePOLineItem = (index: number) => {
        const updatedItems = newPO.line_items.filter((_, i) => i !== index);
        setNewPO({ ...newPO, line_items: updatedItems });
    };

    const handleSavePO = (andExport: boolean) => {
        if (!newPO.supplier || newPO.line_items.length === 0) return alert("Please select a supplier and add at least one item.");

        const total = newPO.line_items.reduce((sum, item) => sum + item.line_total, 0);
        const newOrder: PurchaseOrder = {
            po_id: `PO-2024-${Math.floor(Math.random() * 10000)}`,
            supplier: newPO.supplier,
            order_date: newPO.order_date,
            expected_delivery: newPO.expected_delivery,
            status: 'Draft',
            line_items: newPO.line_items,
            total_amount: total
        };

        if (onUpdateData) {
            onUpdateData({
                ...data,
                purchase_orders: [newOrder, ...data.purchase_orders]
            });
        }

        setIsPOModalOpen(false);
        setNewPO({ supplier: '', order_date: new Date().toISOString().split('T')[0], expected_delivery: '', line_items: [] });

        if (andExport) {
            handlePrintPO(newOrder);
        }
    };

    const totalPOAmount = newPO.line_items.reduce((acc, item) => acc + item.line_total, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Accounting & Orders</h2>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setIsPOModalOpen(true)}
                        className="bg-coffee-600 text-white px-4 py-2 rounded-lg hover:bg-coffee-700 flex items-center shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Purchase Order
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Paid (Month)</p>
                        <h3 className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                        <h3 className="text-2xl font-bold text-amber-600">${totalPending.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-full">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Overdue</p>
                        <h3 className="text-2xl font-bold text-red-600">${totalOverdue.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-red-50 rounded-full">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                </div>
            </div>

            {/* Main Content Area with Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        <button
                            onClick={() => { setActiveTab('invoices'); setFilterStatus('All'); }}
                            className={`${activeTab === 'invoices' ? 'border-coffee-500 text-coffee-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Invoices
                        </button>
                        <button
                            onClick={() => { setActiveTab('purchase_orders'); setFilterStatus('All'); }}
                            className={`${activeTab === 'purchase_orders' ? 'border-coffee-500 text-coffee-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Purchase Orders
                        </button>
                    </nav>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-bold text-gray-700">
                        {activeTab === 'invoices' ? 'Client Invoices' : 'Supplier Purchase Orders'}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select 
                            className="bg-white border border-gray-200 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-coffee-500"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                        >
                            <option value="All">All Status</option>
                            {activeTab === 'invoices' ? (
                                <>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Overdue">Overdue</option>
                                </>
                            ) : (
                                <>
                                    <option value="Draft">Draft</option>
                                    <option value="Sent">Sent</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {/* Table View */}
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">{activeTab === 'invoices' ? 'Invoice ID' : 'PO ID'}</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">{activeTab === 'invoices' ? 'Customer' : 'Supplier'}</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Amount</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activeTab === 'invoices' ? (
                            filteredInvoices.map(inv => (
                                <tr key={inv.invoice_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-sm text-gray-600">{inv.invoice_id}</td>
                                    <td className="p-4 font-medium text-gray-800">{inv.customer_name}</td>
                                    <td className="p-4 text-sm text-gray-500">{inv.invoice_date}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                            inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                            inv.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-gray-700">${inv.total_amount.toFixed(2)}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleGenerateInvoicePDF(inv.invoice_id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            title="Export PDF"
                                        >
                                            <Printer className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            filteredPOs.map(po => (
                                <tr key={po.po_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-sm text-gray-600">{po.po_id}</td>
                                    <td className="p-4 font-medium text-gray-800">{po.supplier}</td>
                                    <td className="p-4 text-sm text-gray-500">{po.order_date}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                            po.status === 'Sent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {po.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-gray-700">${po.total_amount.toFixed(2)}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handlePrintPO(po)}
                                            className="text-gray-400 hover:text-coffee-600 transition-colors"
                                            title="View/Export"
                                        >
                                            <Printer className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        {(activeTab === 'invoices' && filteredInvoices.length === 0) || (activeTab === 'purchase_orders' && filteredPOs.length === 0) ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No records found.</td></tr>
                        ) : null}
                    </tbody>
                </table>
            </div>

            {/* Create PO Modal */}
            {isPOModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-800">Create Purchase Order</h3>
                            <button onClick={() => setIsPOModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Header Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                    <select 
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:outline-none"
                                        value={newPO.supplier}
                                        onChange={(e) => setNewPO({...newPO, supplier: e.target.value})}
                                    >
                                        <option value="">Select Supplier...</option>
                                        {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                                    <input 
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:outline-none"
                                        value={newPO.order_date}
                                        onChange={(e) => setNewPO({...newPO, order_date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery (Opt)</label>
                                    <input 
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:outline-none"
                                        value={newPO.expected_delivery}
                                        onChange={(e) => setNewPO({...newPO, expected_delivery: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Line Items */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-700">Line Items</h4>
                                    <button 
                                        onClick={addPOLineItem}
                                        className="text-sm text-coffee-600 hover:text-coffee-700 font-medium flex items-center"
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Add Item
                                    </button>
                                </div>
                                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                                            <tr>
                                                <th className="p-3">Product</th>
                                                <th className="p-3 w-24">Qty</th>
                                                <th className="p-3 w-32">Unit Cost</th>
                                                <th className="p-3 w-32 text-right">Total</th>
                                                <th className="p-3 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {newPO.line_items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="p-2">
                                                        <select 
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                            value={item.product_id}
                                                            onChange={(e) => updatePOLineItem(index, 'product_id', e.target.value)}
                                                        >
                                                            <option value="">Select Product...</option>
                                                            {data.products.map(p => (
                                                                <option key={p.product_id} value={p.product_id}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="p-2">
                                                        <input 
                                                            type="number" min="1"
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                            value={item.quantity}
                                                            onChange={(e) => updatePOLineItem(index, 'quantity', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <input 
                                                            type="number" min="0" step="0.01"
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                            value={item.unit_cost}
                                                            onChange={(e) => updatePOLineItem(index, 'unit_cost', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="p-2 text-right font-medium">
                                                        ${item.line_total.toFixed(2)}
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button onClick={() => removePOLineItem(index)} className="text-red-500 hover:text-red-700">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {newPO.line_items.length === 0 && (
                                                <tr><td colSpan={5} className="p-4 text-center text-gray-400">No items added.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="flex justify-end items-center text-xl font-bold text-gray-800">
                                Total: ${totalPOAmount.toFixed(2)}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
                            <button 
                                onClick={() => setIsPOModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleSavePO(false)}
                                className="px-4 py-2 bg-coffee-600 text-white hover:bg-coffee-700 rounded-lg shadow-sm flex items-center transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save PO
                            </button>
                            <button 
                                onClick={() => handleSavePO(true)}
                                className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-lg shadow-sm flex items-center transition-colors"
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Save & Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};