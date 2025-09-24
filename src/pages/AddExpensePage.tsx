import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { addExpense, updateExpense, getExpenseById } from '../config/firestore';

const AddExpensePage: React.FC = () => {
  const [payer, setPayer] = useState<'Madhav' | 'Devika'>('Madhav');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCustomShare, setShowCustomShare] = useState(false);
  const [otherPersonShare, setOtherPersonShare] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;

  useEffect(() => {
    if (isEditing && editId) {
      const loadExpense = async () => {
        const expense = await getExpenseById(editId);
        if (expense) {
          setPayer(expense.payer);
          setAmount(expense.amount.toString());
          setDescription(expense.description);
          if (expense.otherPersonShare !== undefined) {
            setShowCustomShare(true);
            setOtherPersonShare(expense.otherPersonShare.toString());
          }
        }
      };
      loadExpense();
    }
  }, [isEditing, editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    setLoading(true);
    try {
      const expenseData = {
        payer,
        amount: Number(amount),
        description: description.trim() || 'No description',
        ...(showCustomShare && otherPersonShare ? { otherPersonShare: Number(otherPersonShare) } : {})
      };
      
      if (isEditing && editId) {
        await updateExpense(editId, expenseData);
      } else {
        await addExpense(expenseData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="relative mb-8">
          <Link to="/" className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300">
            <i className="fas fa-arrow-left mr-2"></i>Back
          </Link>
          <h1 className="text-2xl font-bold text-center">{isEditing ? 'Edit Expense' : 'Add Expense'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Who paid?</label>
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value as 'Madhav' | 'Devika')}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Madhav">Madhav</option>
              <option value="Devika">Devika</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowCustomShare(!showCustomShare)}
              className="text-sm text-blue-400 hover:text-blue-300 mb-2"
            >
              <i className="fas fa-cog mr-1"></i>
              {showCustomShare ? 'Hide' : 'Show'} Custom Share
            </button>
            {showCustomShare && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {payer === 'Madhav' ? 'Devika' : 'Madhav'}'s Share (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={otherPersonShare}
                  onChange={(e) => setOtherPersonShare(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Expense' : 'Add Expense')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpensePage;