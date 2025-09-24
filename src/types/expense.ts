export interface Expense {
  id: string;
  payer: 'Madhav' | 'Devika';
  amount: number;
  description: string;
  otherPersonShare?: number; // Amount the other person owes for this expense
  createdAt: Date;
}