import { useState, useEffect } from "react";
import { BudgetForm } from "./components/BudgetForm";
import { MonthSelector } from "./components/MonthSelector";
import { SummaryCards } from "./components/SummaryCards";
import {
  TransactionList,
  Transaction,
} from "./components/TransactionList";
import { CategoryBreakdown } from "./components/CategoryBreakdown";
import { Wallet, Database, HardDrive } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a00cd525`;

function App() {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [loading, setLoading] = useState(true);
  const [storageMode, setStorageMode] = useState<
    "database" | "local"
  >("database");

  // Load transactions from database on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Save to localStorage only when in local mode
  useEffect(() => {
    if (storageMode === "local") {
      localStorage.setItem(
        "budgetTransactions",
        JSON.stringify(transactions),
      );
    }
  }, [transactions, storageMode]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      console.log(
        "Fetching transactions from Supabase database...",
      );

      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log("Response from server:", data);

      if (data.success) {
        setTransactions(data.transactions);
        setStorageMode("database");
        console.log(
          "Successfully loaded transactions from database:",
          data.transactions.length,
        );
      } else {
        throw new Error(
          data.error || "Failed to fetch transactions",
        );
      }
    } catch (err) {
      console.warn(
        "Database connection failed, using localStorage fallback:",
        err,
      );
      setStorageMode("local");

      // Load from localStorage
      const saved = localStorage.getItem("budgetTransactions");
      if (saved) {
        try {
          setTransactions(JSON.parse(saved));
        } catch (parseError) {
          setTransactions([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (
    transaction: Omit<Transaction, "id">,
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    if (storageMode === "local") {
      setTransactions([...transactions, newTransaction]);
      return;
    }

    try {
      console.log("Adding transaction to database...");
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTransactions([...transactions, newTransaction]);
        console.log(
          "Transaction added to database successfully",
        );
      } else {
        throw new Error(
          data.error || "Failed to add transaction",
        );
      }
    } catch (err) {
      console.error(
        "Failed to add to database, switching to localStorage:",
        err,
      );
      setStorageMode("local");
      setTransactions([...transactions, newTransaction]);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (storageMode === "local") {
      setTransactions(transactions.filter((t) => t.id !== id));
      return;
    }

    try {
      console.log("Deleting transaction from database...");
      const response = await fetch(
        `${API_URL}/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTransactions(
          transactions.filter((t) => t.id !== id),
        );
        console.log(
          "Transaction deleted from database successfully",
        );
      } else {
        throw new Error(
          data.error || "Failed to delete transaction",
        );
      }
    } catch (err) {
      console.error(
        "Failed to delete from database, switching to localStorage:",
        err,
      );
      setStorageMode("local");
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  // Filter transactions for current month
  const monthTransactions = transactions.filter((t) => {
    return t.date.startsWith(currentMonth);
  });

  // Calculate totals for current month
  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Wallet className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Student Budget Tracker
            </h1>
          </div>
          <p className="text-gray-600">
            Track your daily expenses and savings for better
            financial management
          </p>

          {/* Storage Mode Indicator */}
          <div className="mt-4 mx-auto max-w-2xl">
            {storageMode === "database" ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-center gap-2 text-sm">
                <Database className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800">
                  <strong>Cloud Storage Active:</strong> Your
                  data is saved in Supabase database
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-center gap-2 text-sm">
                <HardDrive className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-yellow-800">
                  <strong>Local Storage Mode:</strong> Data
                  saved in browser only
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Month Selector */}
        <div className="mb-6">
          <MonthSelector
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </div>

        {/* Summary Cards */}
        <div className="mb-6">
          <SummaryCards
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            totalSavings={totalSavings}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Budget Form */}
          <div className="lg:col-span-1">
            <BudgetForm
              onAddTransaction={handleAddTransaction}
            />
          </div>

          {/* Transaction List */}
          <div className="lg:col-span-2">
            <TransactionList
              transactions={monthTransactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <CategoryBreakdown transactions={monthTransactions} />
      </div>
    </div>
  );
}

export default App;