import { Trash2, Calendar } from 'lucide-react';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No transactions yet. Add your first transaction above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      <div className="space-y-6">
        {sortedDates.map((date) => {
          const dayTransactions = groupedTransactions[date];
          const dayTotal = dayTransactions.reduce((sum, t) => {
            return sum + (t.type === 'income' ? t.amount : -t.amount);
          }, 0);

          return (
            <div key={date} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{formatDate(date)}</span>
                </div>
                <span
                  className={`font-semibold ${
                    dayTotal >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {dayTotal >= 0 ? '+' : ''}₹{dayTotal.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                {dayTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{transaction.description}</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {transaction.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}₹
                        {transaction.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}