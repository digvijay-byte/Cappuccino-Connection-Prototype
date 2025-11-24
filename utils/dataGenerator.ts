import { AppData, Product, InventoryItem, SaleTransaction, Invoice, InvoiceLineItem, PredictionOutput, PurchaseOrder, PurchaseOrderLineItem } from '../types';

export const generateMockData = (): AppData => {
  const products: Product[] = [
    { product_id: "P001", name: "Espresso Beans – Dark Roast 1kg", category: "Coffee", sku: "CB-DR-001", unit: "kg", reorder_level: 10, supplier: "Atlanta Coffee Supply Co.", cost_price: 15.00, selling_price: 35.00 },
    { product_id: "P002", name: "House Blend Coffee Beans 500g", category: "Coffee", sku: "CB-HB-002", unit: "pack", reorder_level: 15, supplier: "Atlanta Coffee Supply Co.", cost_price: 8.50, selling_price: 18.00 },
    { product_id: "P003", name: "Vanilla Latte Syrup 1L", category: "Coffee", sku: "SY-VAN-003", unit: "bottle", reorder_level: 5, supplier: "Sweet Tooth Syrups", cost_price: 6.00, selling_price: 14.00 },
    { product_id: "P004", name: "Caramel Sauce Topping 2kg", category: "Coffee / Dessert", sku: "TP-CAR-004", unit: "bottle", reorder_level: 4, supplier: "Sweet Tooth Syrups", cost_price: 12.00, selling_price: 28.00 },
    { product_id: "P005", name: "Hot Chocolate Mix 1kg Bag", category: "Chocolate", sku: "CH-HOT-005", unit: "bag", reorder_level: 8, supplier: "Cocoa & Co.", cost_price: 9.00, selling_price: 22.00 },
    { product_id: "P006", name: "Milk Chocolate Fountain Chocolate 2kg", category: "Chocolate", sku: "CH-FTN-MK-006", unit: "bag", reorder_level: 5, supplier: "Cocoa & Co.", cost_price: 25.00, selling_price: 60.00 },
    { product_id: "P007", name: "Dark Chocolate Fountain Chocolate 2kg", category: "Chocolate", sku: "CH-FTN-DK-007", unit: "bag", reorder_level: 5, supplier: "Cocoa & Co.", cost_price: 26.00, selling_price: 62.00 },
    { product_id: "P008", name: "Disposable Coffee Cups – 12oz Pack of 100", category: "Packaging", sku: "EQ-CUP-008", unit: "pack", reorder_level: 20, supplier: "EcoPack Supplies", cost_price: 5.00, selling_price: 12.00 },
    { product_id: "P009", name: "Whipped Cream Canister – 500ml", category: "Equipment", sku: "EQ-WHIP-009", unit: "can", reorder_level: 10, supplier: "Dairy Direct", cost_price: 3.50, selling_price: 0.00 }, // Internal use mostly
    { product_id: "P010", name: "Strawberry Smoothie Mix 1L", category: "Smoothie", sku: "SM-STR-010", unit: "carton", reorder_level: 6, supplier: "Fresh Blends", cost_price: 7.00, selling_price: 16.00 },
  ];

  // 2. Current Inventory
  const current_inventory: InventoryItem[] = products.map(p => {
    // Random stock, some low for demo purposes
    let stock = Math.floor(Math.random() * 50) + 5;
    if (p.product_id === "P001") stock = 8; // Low stock demo
    if (p.product_id === "P006") stock = 3; // Critically low

    return {
      product_id: p.product_id,
      current_stock: stock,
      warehouse_location: Math.random() > 0.5 ? "Main Warehouse" : "Cold Storage",
      last_updated: new Date().toISOString().split('T')[0]
    };
  });

  // 3. Sales History (Last 60 days)
  const sales_history: SaleTransaction[] = [];
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    products.forEach(p => {
      // Logic: Coffee sells daily. Chocolate spikes on weekends.
      let shouldSell = false;
      let qty = 0;
      let event = undefined;

      if (p.category.includes("Coffee")) {
        shouldSell = Math.random() > 0.3; // 70% chance daily
        qty = Math.floor(Math.random() * 5) + 1;
        if (p.product_id === "P008") qty = Math.floor(Math.random() * 3) + 1; // Cups packs
      } else if (p.category.includes("Chocolate") && isWeekend) {
        shouldSell = Math.random() > 0.2; // High chance on weekend
        qty = Math.floor(Math.random() * 10) + 2;
        event = "Weekend Event";
      } else {
        shouldSell = Math.random() > 0.7; // Occasional
        qty = Math.floor(Math.random() * 3) + 1;
      }

      if (shouldSell) {
        sales_history.push({
          transaction_id: `TXN-${Math.floor(Math.random() * 100000)}`,
          product_id: p.product_id,
          date: dateStr,
          quantity_used_or_sold: qty,
          event_name: event
        });
      }
    });
  }
  sales_history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 4. Invoices
  const invoices: Invoice[] = [];
  const customers = ["Atlanta Events Co.", "Downtown Catering LLC", "TechHub Corporate", "Weddings by Sarah", "City Hall Events"];
  
  for (let i = 0; i < 15; i++) {
     const invDate = new Date();
     invDate.setDate(invDate.getDate() - Math.floor(Math.random() * 45));
     const dueDate = new Date(invDate);
     dueDate.setDate(invDate.getDate() + 30);
     
     const statusRoll = Math.random();
     const status = statusRoll > 0.6 ? 'Paid' : (statusRoll > 0.3 ? 'Pending' : 'Overdue');
     
     // Generate line items
     const line_items: InvoiceLineItem[] = [];
     const numItems = Math.floor(Math.random() * 3) + 1;
     let total = 0;
     
     for(let k=0; k<numItems; k++) {
        const prod = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(Math.random() * 10) + 1;
        const lineTotal = qty * prod.selling_price;
        total += lineTotal;
        line_items.push({
            product_id: prod.product_id,
            quantity: qty,
            unit_price: prod.selling_price,
            line_total: lineTotal
        });
     }

     invoices.push({
         invoice_id: `INV-2024-${1000 + i}`,
         invoice_date: invDate.toISOString().split('T')[0],
         customer_name: customers[Math.floor(Math.random() * customers.length)],
         status: status,
         due_date: dueDate.toISOString().split('T')[0],
         line_items,
         total_amount: total
     });
  }

  // 5. Purchase Orders (Mock)
  const purchase_orders: PurchaseOrder[] = [
    {
      po_id: "PO-2024-8890",
      supplier: "Atlanta Coffee Supply Co.",
      order_date: "2024-11-20",
      status: "Sent",
      line_items: [
        { product_id: "P001", quantity: 50, unit_cost: 15.00, line_total: 750.00 }
      ],
      total_amount: 750.00
    },
    {
      po_id: "PO-2024-8892",
      supplier: "Cocoa & Co.",
      order_date: "2024-11-25",
      status: "Draft",
      line_items: [
        { product_id: "P006", quantity: 10, unit_cost: 25.00, line_total: 250.00 },
        { product_id: "P007", quantity: 10, unit_cost: 26.00, line_total: 260.00 }
      ],
      total_amount: 510.00
    }
  ];

  // 6. Prediction Output
  const prediction_output: PredictionOutput[] = products.map(p => {
     const inv = current_inventory.find(i => i.product_id === p.product_id)!;
     // Simple fake heuristic
     const avgDaily = (Math.random() * 2) + 0.1; 
     const next7 = Math.round(avgDaily * 7);
     const next30 = Math.round(avgDaily * 30);
     const stock = inv.current_stock;
     
     const risk = stock < next7 ? 'High' : (stock < next30 ? 'Medium' : 'Low');
     const restock = Math.max(0, next30 - stock);

     let comment = "Stock level is stable.";
     if (risk === 'High') comment = `Critical: Will run out in ~${Math.floor(stock/avgDaily)} days. Reorder immediately.`;
     else if (risk === 'Medium') comment = "Monitor closely. Reorder likely needed within 2 weeks.";
     
     return {
         product_id: p.product_id,
         avg_daily_usage: parseFloat(avgDaily.toFixed(2)),
         predicted_usage_next_7_days: next7,
         predicted_usage_next_30_days: next30,
         current_stock: stock,
         recommended_restock_qty: restock,
         stock_out_risk: risk,
         comment
     };
  });

  return { products, current_inventory, sales_history, invoices, purchase_orders, prediction_output };
};