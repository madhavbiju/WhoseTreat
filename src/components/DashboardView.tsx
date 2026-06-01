import React, { useState, useRef, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Sparkles, Coffee, Heart, PlusCircle, Check, Loader2 } from 'lucide-react';

const DashboardView: React.FC = () => {
  const { stats, addNewExpense } = useExpenses();
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [paidBy, setPaidBy] = useState<'me' | 'her'>('me');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const amountInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus amount input on mount for the ultra-fast "5-second log"
  useEffect(() => {
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Please enter a valid amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addNewExpense(parsedAmount, description.trim(), paidBy);
      
      // Success micro-interaction
      setSubmitSuccess(true);
      setAmount('');
      setDescription('');
      
      // Flash success, then refocus input
      setTimeout(() => {
        setSubmitSuccess(false);
        if (amountInputRef.current) {
          amountInputRef.current.focus();
        }
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { balanceScore } = stats;
  const absBalance = Math.abs(balanceScore);
  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(absBalance);

  // Determine Turn Indicator Styling & Copy based on balanceScore
  let turnCardStyle = "from-emerald-50 to-teal-50 border-emerald-100 text-emerald-800 shadow-emerald-50 dark:from-emerald-950/20 dark:to-teal-950/20 dark:border-emerald-900/30 dark:text-emerald-200 dark:shadow-none";
  let turnCardIcon = <Heart className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-900/30 dark:text-emerald-400 animate-pulse" />;
  let turnTitle = "You are perfectly even!";
  let turnSubtitle = "A beautiful match. Keep enjoying treats together!";

  if (balanceScore > 0) {
    // Him has spent more -> Her turn to treat
    turnCardStyle = "from-rose-50 to-pink-50 border-rose-100 text-rose-800 shadow-rose-50 dark:from-rose-950/20 dark:to-pink-950/20 dark:border-rose-900/30 dark:text-rose-200 dark:shadow-none";
    turnCardIcon = <Sparkles className="w-6 h-6 text-rose-500 dark:text-rose-400 animate-bounce" />;
    turnTitle = "Her turn to treat!";
    turnSubtitle = `He spent ${formattedBalance} more overall. Time to treat Him!`;
  } else if (balanceScore < 0) {
    // Her has spent more -> His turn to treat
    turnCardStyle = "from-sky-50 to-indigo-50 border-sky-100 text-indigo-800 shadow-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20 dark:border-sky-900/30 dark:text-sky-200 dark:shadow-none";
    turnCardIcon = <Coffee className="w-6 h-6 text-indigo-500 dark:text-indigo-400 animate-wiggle" />;
    turnTitle = "His turn to treat!";
    turnSubtitle = `She spent ${formattedBalance} more overall. Time to treat Her!`;
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-6 space-y-6">
      {/* Turn Indicator Card */}
      <div 
        className={`bg-gradient-to-br ${turnCardStyle} border rounded-2xl p-5 shadow-sm transition-all duration-300 transform hover:scale-[1.01] flex items-start space-x-4`}
      >
        <div className="p-3 bg-white/80 dark:bg-[#222530]/80 rounded-xl shadow-xs shrink-0 flex items-center justify-center transition-colors duration-300">
          {turnCardIcon}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg leading-tight tracking-tight">{turnTitle}</h3>
          <p className="text-sm opacity-90 leading-relaxed font-medium">{turnSubtitle}</p>
        </div>
      </div>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center space-y-6 max-w-sm mx-auto w-full">
        <div className="space-y-4">
          
          {/* Amount Field (Huge visual emphasis) */}
          <div className="text-center space-y-2">
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              How Much?
            </label>
            <div className="relative inline-flex items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-400 dark:text-slate-600 mr-1 select-none">₹</span>
              <input
                ref={amountInputRef}
                type="number"
                inputMode="decimal"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                disabled={isSubmitting}
                className="w-48 bg-transparent text-center text-5xl font-black text-slate-800 dark:text-slate-100 placeholder-slate-200 dark:placeholder-slate-800 focus:outline-none focus:placeholder-transparent transition-all border-b-2 border-transparent focus:border-slate-300 dark:focus:border-slate-700 pb-1"
              />
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              For What?
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Dinner, Coffee, Groceries"
              disabled={isSubmitting}
              className="w-full bg-slate-100/60 dark:bg-[#222530]/60 border border-slate-200/60 dark:border-[#2C303D]/60 rounded-xl p-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-[#222530] focus:border-slate-300 dark:focus:border-[#2C303D]/80 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800/20 transition-all font-medium"
            />
          </div>

          {/* Who Paid Toggle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-1">
              Who Paid?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Him Button */}
              <button
                type="button"
                onClick={() => setPaidBy('me')}
                disabled={isSubmitting}
                className={`py-3.5 rounded-xl border-2 text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-300 ${
                  paidBy === 'me'
                    ? 'bg-sky-50/70 border-sky-400 text-sky-800 dark:bg-sky-950/30 dark:border-sky-500 dark:text-sky-300 shadow-sm shadow-sky-50 dark:shadow-none ring-4 ring-sky-100/50 dark:ring-sky-900/30 scale-[1.02]'
                    : 'bg-white dark:bg-[#222530] border-slate-200 dark:border-[#2C303D] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-[#2C303D]/80 active:scale-95'
                }`}
              >
                <span className="text-base">🙋‍♂️</span>
                <span>Him</span>
              </button>

              {/* Her Button */}
              <button
                type="button"
                onClick={() => setPaidBy('her')}
                disabled={isSubmitting}
                className={`py-3.5 rounded-xl border-2 text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-300 ${
                  paidBy === 'her'
                    ? 'bg-pink-50/70 border-pink-400 text-pink-800 dark:bg-pink-950/30 dark:border-pink-500 dark:text-pink-300 shadow-sm shadow-pink-50 dark:shadow-none ring-4 ring-pink-100/50 dark:ring-pink-900/30 scale-[1.02]'
                    : 'bg-white dark:bg-[#222530] border-slate-200 dark:border-[#2C303D] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-[#2C303D]/80 active:scale-95'
                }`}
              >
                <span className="text-base">🙋‍♀️</span>
                <span>Her</span>
              </button>
            </div>
          </div>
        </div>

        {formError && (
          <p className="text-xs text-rose-500 font-bold text-center animate-shake">
            ⚠️ {formError}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !amount}
          className={`w-full py-4 rounded-xl text-white font-bold tracking-wide shadow-md flex items-center justify-center gap-2 transform transition-all duration-300 active:scale-[0.98] cursor-pointer ${
            submitSuccess
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-emerald-100 dark:shadow-none'
              : 'bg-gradient-to-r from-teal-400 to-emerald-400 hover:shadow-emerald-200/50 dark:hover:shadow-none hover:scale-[1.01] hover:shadow-lg disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 dark:disabled:bg-[#222530] dark:disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Logging Expense...</span>
            </>
          ) : submitSuccess ? (
            <>
              <Check className="w-5 h-5" />
              <span>Logged Successfully!</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              <span>Log Expense</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DashboardView;
