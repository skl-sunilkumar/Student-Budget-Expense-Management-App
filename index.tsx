import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a00cd525/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all transactions
app.get("/make-server-a00cd525/transactions", async (c) => {
  try {
    console.log("Fetching transactions from database...");
    const transactions = await kv.get("budget_transactions");
    console.log("Transactions fetched:", transactions ? transactions.length : 0);
    return c.json({ success: true, transactions: transactions || [] });
  } catch (error) {
    console.error("Error fetching transactions from database:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add a new transaction
app.post("/make-server-a00cd525/transactions", async (c) => {
  try {
    const transaction = await c.req.json();
    console.log("Adding transaction to database:", transaction.id);
    
    const transactions = await kv.get("budget_transactions") || [];
    transactions.push(transaction);
    await kv.set("budget_transactions", transactions);
    
    console.log("Transaction added successfully. Total transactions:", transactions.length);
    return c.json({ success: true, transaction });
  } catch (error) {
    console.error("Error adding transaction to database:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a transaction by ID
app.delete("/make-server-a00cd525/transactions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log("Deleting transaction from database:", id);
    
    const transactions = await kv.get("budget_transactions") || [];
    const filteredTransactions = transactions.filter((t: any) => t.id !== id);
    await kv.set("budget_transactions", filteredTransactions);
    
    console.log("Transaction deleted successfully. Remaining transactions:", filteredTransactions.length);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction from database:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);