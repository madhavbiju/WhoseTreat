import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Expense, Stats } from '../types/expense';
import { getExpenses, addExpense, deleteExpense } from '../config/firestore';

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  stats: Stats;
  addNewExpense: (amount: number, description: string, paidBy: 'me' | 'her') => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  refreshExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpensesList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err: any) {
      console.error('Error fetching expenses from Firestore:', err);
      setError('Failed to load expenses. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpensesList();
  }, [fetchExpensesList]);

  const addNewExpense = useCallback(async (amount: number, description: string, paidBy: 'me' | 'her') => {
    try {
      await addExpense({ amount, description, paidBy });
      await fetchExpensesList();
    } catch (err: any) {
      console.error('Error adding expense to Firestore:', err);
      throw new Error('Failed to log expense. Please try again.');
    }
  }, [fetchExpensesList]);

  const removeExpense = useCallback(async (id: string) => {
    try {
      await deleteExpense(id);
      await fetchExpensesList();
    } catch (err: any) {
      console.error('Error deleting expense from Firestore:', err);
      throw new Error('Failed to delete expense. Please try again.');
    }
  }, [fetchExpensesList]);

  const stats = useMemo<Stats>(() => {
    const totalSpentByMe = expenses
      .filter(e => e.paidBy === 'me')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSpentByHer = expenses
      .filter(e => e.paidBy === 'her')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      totalSpentByMe,
      totalSpentByHer,
      combinedTotal: totalSpentByMe + totalSpentByHer,
      balanceScore: totalSpentByMe - totalSpentByHer
    };
  }, [expenses]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        error,
        stats,
        addNewExpense,
        removeExpense,
        refreshExpenses: fetchExpensesList
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
