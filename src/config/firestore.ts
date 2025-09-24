import { collection, addDoc, getDocs, query, orderBy, where, Timestamp, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Expense } from '../types/expense';

export const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
  await addDoc(collection(db, 'expenses'), {
    ...expense,
    createdAt: Timestamp.now()
  });
};

export const getExpenses = async (): Promise<Expense[]> => {
  const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Expense[];
};

export const getMonthlyExpenses = async (): Promise<Expense[]> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const q = query(
    collection(db, 'expenses'),
    where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Expense[];
};

export const updateExpense = async (id: string, expense: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
  const docRef = doc(db, 'expenses', id);
  await updateDoc(docRef, expense);
};

export const getExpenseById = async (id: string): Promise<Expense | null> => {
  const docRef = doc(db, 'expenses', id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt.toDate()
    } as Expense;
  }
  return null;
};

export const deleteExpense = async (id: string) => {
  const docRef = doc(db, 'expenses', id);
  await deleteDoc(docRef);
};