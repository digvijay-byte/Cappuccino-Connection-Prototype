export interface Product {
  product_id: string;
  name: string;
  category: string;
  sku: string;
  unit: string;
  reorder_level: number;
  supplier: string;
  cost_price: number;
  selling_price: number;
}

export interface InventoryItem {
  product_id: string;
  current_stock: number;
  warehouse_location: string;
  last_updated: string;
}

export interface SaleTransaction {
  transaction_id: string;
  product_id: string;
  date: string;
  quantity_used_or_sold: number;
  event_name?: string;
}

export interface InvoiceLineItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Invoice {
  invoice_id: string;
  invoice_date: string;
  customer_name: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  due_date: string;
  line_items: InvoiceLineItem[];
  total_amount: number;
}

export interface PurchaseOrderLineItem {
  product_id: string;
  quantity: number;
  unit_cost: number;
  line_total: number;
}

export interface PurchaseOrder {
  po_id: string;
  supplier: string;
  order_date: string;
  expected_delivery?: string;
  status: 'Draft' | 'Sent';
  line_items: PurchaseOrderLineItem[];
  total_amount: number;
}

export interface PredictionOutput {
  product_id: string;
  avg_daily_usage: number;
  predicted_usage_next_7_days: number;
  predicted_usage_next_30_days: number;
  current_stock: number;
  recommended_restock_qty: number;
  stock_out_risk: 'Low' | 'Medium' | 'High';
  comment: string;
}

export interface AppData {
  products: Product[];
  current_inventory: InventoryItem[];
  sales_history: SaleTransaction[];
  invoices: Invoice[];
  purchase_orders: PurchaseOrder[];
  prediction_output: PredictionOutput[];
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  SMART_RESTOCK = 'SMART_RESTOCK',
  SALES = 'SALES',
  ACCOUNTING = 'ACCOUNTING',
  IMPORT = 'IMPORT'
}