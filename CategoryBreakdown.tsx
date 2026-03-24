import { Transaction } from './TransactionList';

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

export function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const incomeTransactions = transactions.filter((t) => t.type === 'income');

  const calculateCategoryTotals = (trans: Transaction[]) => {
    const totals: Record<string, number> = {};
    trans.forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    return totals;
  };

  const expenseCategories = calculateCategoryTotals(expenseTransactions);
  const incomeCategories = calculateCategoryTotals(incomeTransactions);

  const totalExpenses = Object.values(expenseCategories).reduce((sum, val) => sum + val, 0);
  const totalIncome = Object.values(incomeCategories).reduce((sum, val) => sum + val, 0);

  const CategorySection = ({
    title,
    categories,
    total,
    color,
  }: {
    title: string;
    categories: Record<string, number>;
    total: number;
    color: string;
  }) => {
    if (Object.keys(categories).length === 0) {
      return null;
    }

    return (
      <div className="mb-6 last:mb-0">
        <h3 className="font-semibold mb-3">{title}</h3>
        <div className="space-y-3">
          {Object.entries(categories)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => {
              const percentage = total > 0 ? (amount / total) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category}</span>
                    <span className="font-medium">
                      ₹{amount.toFixed(2)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>

      <CategorySection
        title="Expenses by Category"
        categories={expenseCategories}
        total={totalExpenses}
        color="bg-red-500"
      />

      <CategorySection
        title="Income by Source"
        categories={incomeCategories}
        total={totalIncome}
        color="bg-green-500"
      />
    </div>
  );
}