import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
}

export function MonthSelector({ currentMonth, onMonthChange }: MonthSelectorProps) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [year, month] = currentMonth.split('-').map(Number);
  const currentMonthIndex = month - 1;

  const handlePrevMonth = () => {
    const newMonth = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    const newYear = currentMonthIndex === 0 ? year - 1 : year;
    onMonthChange(`${newYear}-${String(newMonth + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const newMonth = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1;
    const newYear = currentMonthIndex === 11 ? year + 1 : year;
    onMonthChange(`${newYear}-${String(newMonth + 1).padStart(2, '0')}`);
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
      <button
        onClick={handlePrevMonth}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {months[currentMonthIndex]} {year}
        </h2>
      </div>

      <button
        onClick={handleNextMonth}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Next month"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
