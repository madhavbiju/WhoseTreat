export interface Expense {
  id: string;
  amount: number;
  description: string;
  paidBy: 'me' | 'her';
  createdAt: Date;
}

export interface Stats {
  totalSpentByMe: number;
  totalSpentByHer: number;
  combinedTotal: number;
  balanceScore: number;
}