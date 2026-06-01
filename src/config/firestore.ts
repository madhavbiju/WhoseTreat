import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Expense } from '../types/expense';

const COLLECTION_NAME = 'shared_expenses';

export const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<void> => {
  await addDoc(collection(db, COLLECTION_NAME), {
    amount: expense.amount,
    description: expense.description,
    paidBy: expense.paidBy,
    createdAt: Timestamp.now()
  });
};

export const getExpenses = async (): Promise<Expense[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      amount: Number(data.amount) || 0,
      description: data.description || '',
      paidBy: data.paidBy as 'me' | 'her',
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date()
    };
  });
};

export const deleteExpense = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};