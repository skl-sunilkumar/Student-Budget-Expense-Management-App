import { DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
}

export function SummaryCards({ totalIncome, totalExpenses, totalSavings }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm mb-1">Total Income</p>
            <p className="text-3xl font-bold">₹{totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm mb-1">Total Expenses</p>
            <p className="text-3xl font-bold">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <TrendingDown className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">Total Savings</p>
            <p className="text-3xl font-bold">₹{totalSavings.toFixed(2)}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Wallet className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}