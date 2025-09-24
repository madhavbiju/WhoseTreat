import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMonthlyExpenses, deleteExpense } from '../config/firestore';
import { Expense } from '../types/expense';

const HomePage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const data = await getMonthlyExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (expense: Expense) => {
    if (window.confirm(`Delete expense "${expense.description}" for ₹${expense.amount}?`)) {
      try {
        await deleteExpense(expense.id);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  // Calculate what each person actually spent
  const madhavSpent = expenses.filter(e => e.payer === 'Madhav').reduce((sum, e) => sum + e.amount, 0);
  const devikaSpent = expenses.filter(e => e.payer === 'Devika').reduce((sum, e) => sum + e.amount, 0);
  const totalSpend = madhavSpent + devikaSpent;
  
  // Calculate what each person owes based on custom shares or 50/50 split
  let madhavOwes = 0;
  let devikaOwes = 0;
  
  expenses.forEach(expense => {
    if (expense.payer === 'Madhav') {
      // Madhav paid, so Devika owes her share
      const devikaShare = expense.otherPersonShare ?? expense.amount / 2;
      devikaOwes += devikaShare;
    } else {
      // Devika paid, so Madhav owes his share
      const madhavShare = expense.otherPersonShare ?? expense.amount / 2;
      madhavOwes += madhavShare;
    }
  });
  
  // Net balance: positive means Madhav owes Devika, negative means Devika owes Madhav
  const netBalance = madhavOwes - devikaOwes;
  const owes = netBalance > 0 ? 'Madhav' : 'Devika';
  const owedAmount = Math.abs(netBalance);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Who Owes Who?</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Spend This Month</h2>
          <p className="text-4xl font-bold text-green-400">₹{totalSpend.toFixed(2)}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Balance</h2>
          {owedAmount === 0 ? (
            <p className="text-2xl font-bold text-green-400">All settled! <i className="fas fa-check-circle"></i></p>
          ) : (
            <p className="text-2xl font-bold text-yellow-400">
              {owes} owes ₹{owedAmount.toFixed(2)}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Madhav's Total</h2>
            <p className="text-3xl font-bold text-blue-400">₹{madhavSpent.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Devika's Total</h2>
            <p className="text-3xl font-bold text-pink-400">₹{devikaSpent.toFixed(2)}</p>
          </div>
        </div>

        <hr className="border-gray-700 mb-8" />

        <div className="bg-gray-800 p-6 rounded-lg mb-24">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-gray-400">No expenses this month</p>
          ) : (
            <div className="space-y-3">
              {expenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <div>
                    <p className="font-medium">{expense.description || 'No description'}</p>
                    <p className="text-sm text-gray-400">
                      {expense.payer} • {expense.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold">₹{expense.amount.toFixed(2)}</p>
                    <Link
                      to={`/add?edit=${expense.id}`}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      onClick={() => handleDelete(expense)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 inline-flex group">
        <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200"></div>
        <Link
          to="/add"
          className="relative inline-flex items-center justify-center px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          <i className="fas fa-plus mr-2"></i>Add Expense
        </Link>
      </div>
    </div>
  );
};

export default HomePage;