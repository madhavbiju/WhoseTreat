import React, { useState, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Trash2, Inbox } from 'lucide-react';
import { Expense } from '../types/expense';

const HistoryAnalyticsView: React.FC = () => {
  const { expenses, removeExpense } = useExpenses();
  const [showAll, setShowAll] = useState<boolean>(false);

  // Dynamic current month formatting for card labels
  const monthName = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', { month: 'long' });
  }, []);

  const startOfCurrentMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, []);

  // Filter stats and feed strictly to the current calendar month
  const monthlyData = useMemo(() => {
    // Sort transactions within this calendar month
    const monthlyExpenses = expenses.filter(e => e.createdAt >= startOfCurrentMonth);
    
    const totalSpentByMe = monthlyExpenses
      .filter(e => e.paidBy === 'me')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSpentByHer = monthlyExpenses
      .filter(e => e.paidBy === 'her')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      monthlyExpenses,
      totalSpentByMe,
      totalSpentByHer,
      combinedTotal: totalSpentByMe + totalSpentByHer
    };
  }, [expenses, startOfCurrentMonth]);

  // Determine if there are transactions older than the current month
  const hasOlder = useMemo(() => {
    return expenses.some(e => e.createdAt < startOfCurrentMonth);
  }, [expenses, startOfCurrentMonth]);

  // Calculate what is currently displayed in the list
  const displayedExpenses = useMemo(() => {
    if (showAll) return expenses;
    return monthlyData.monthlyExpenses;
  }, [expenses, showAll, monthlyData.monthlyExpenses]);

  const handleDelete = async (expense: Expense) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(expense.amount);

    if (window.confirm(`Delete expense "${expense.description || 'No Description'}" for ${formattedAmount}?`)) {
      try {
        await removeExpense(expense.id);
      } catch (err: any) {
        alert(err.message || 'Failed to delete expense.');
      }
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
      
      {/* Stats Summary Cards (Current Month Counts Only) */}
      <div className="grid grid-cols-3 gap-2.5 select-none">
        {/* Spent by Him */}
        <div className="bg-gradient-to-br from-sky-50/70 to-blue-50/50 border border-sky-100 dark:from-sky-950/20 dark:to-blue-950/20 dark:border-sky-900/30 text-sky-950 dark:text-sky-200 rounded-2xl p-3 flex flex-col justify-between shadow-xs transition-all duration-300">
          <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 tracking-wide uppercase">His Spend</span>
          <span className="text-sm font-extrabold truncate mt-1">
            {formatCurrency(monthlyData.totalSpentByMe)}
          </span>
        </div>

        {/* Spent by Her */}
        <div className="bg-gradient-to-br from-rose-50/70 to-pink-50/50 border border-rose-100 dark:from-rose-950/20 dark:to-pink-950/20 dark:border-rose-900/30 text-rose-950 dark:text-rose-200 rounded-2xl p-3 flex flex-col justify-between shadow-xs transition-all duration-300">
          <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 tracking-wide uppercase">Her Spend</span>
          <span className="text-sm font-extrabold truncate mt-1">
            {formatCurrency(monthlyData.totalSpentByHer)}
          </span>
        </div>

        {/* Combined Spend */}
        <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-100 dark:from-emerald-950/20 dark:to-teal-950/20 dark:border-emerald-900/30 text-emerald-950 dark:text-emerald-200 rounded-2xl p-3 flex flex-col justify-between shadow-xs transition-all duration-300">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">Combined</span>
          <span className="text-sm font-extrabold truncate mt-1">
            {formatCurrency(monthlyData.combinedTotal)}
          </span>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3.5 px-1 select-none">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
            {showAll ? 'All History' : `${monthName} History`}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {displayedExpenses.length} {displayedExpenses.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {displayedExpenses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-[#222530]/20 rounded-2xl border border-slate-100 dark:border-[#2C303D]/50 border-dashed transition-colors duration-300 select-none">
            <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600 stroke-1.5 mb-3" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">No treats logged in {monthName}!</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[180px] leading-relaxed mb-4">
              Log your first treat for this month on the dashboard!
            </p>
            {hasOlder && (
              <button
                onClick={() => setShowAll(true)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 py-2 px-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 dark:bg-[#222530] dark:border-[#2C303D] transition-all duration-200 cursor-pointer shadow-xs"
              >
                Show older transactions
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-3 min-h-0 pb-4">
            {displayedExpenses.map((expense) => {
              const isMe = expense.paidBy === 'me';
              return (
                <div 
                  key={expense.id}
                  className="bg-white dark:bg-[#222530] border border-slate-100 dark:border-[#2C303D] rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-md dark:hover:shadow-none hover:border-slate-200/60 dark:hover:border-[#2C303D]/80 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-2xl select-none shrink-0">
                      {isMe ? '🙋‍♂️' : '🙋‍♀️'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate leading-snug">
                        {expense.description || 'Treat'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                          {formatDate(expense.createdAt)}
                        </span>
                        <span className="text-slate-200 dark:text-slate-700 text-xs select-none">•</span>
                        <span 
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border tracking-wide uppercase select-none ${
                            isMe 
                              ? 'bg-sky-50 border-sky-100 text-sky-700 dark:bg-sky-950/30 dark:border-sky-900/50 dark:text-sky-400' 
                              : 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400'
                          }`}
                        >
                          {isMe ? 'Paid by Him' : 'Paid by Her'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {formatCurrency(expense.amount)}
                    </span>
                    <button
                      onClick={() => handleDelete(expense)}
                      aria-label="Delete expense"
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:text-slate-600 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 rounded-lg active:scale-95 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 stroke-2" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Toggle Button at the bottom of the list */}
            {showAll ? (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowAll(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 py-2.5 px-4 rounded-xl bg-slate-100/50 hover:bg-slate-100 dark:bg-[#1A1C23]/40 dark:hover:bg-[#1A1C23]/80 border border-transparent dark:border-[#2C303D]/30 transition-all duration-200 cursor-pointer"
                >
                  Show current month only
                </button>
              </div>
            ) : (
              hasOlder && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setShowAll(true)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 py-2.5 px-4 rounded-xl bg-slate-100/50 hover:bg-slate-100 dark:bg-[#1A1C23]/40 dark:hover:bg-[#1A1C23]/80 border border-transparent dark:border-[#2C303D]/30 transition-all duration-200 cursor-pointer"
                  >
                    Show older transactions
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryAnalyticsView;
