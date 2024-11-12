export type QuickTransactionProps = {
  friends: string[];
  value: number;
  message: string;
  date: string;
};

export type TransactionProps = {
  log?: Transaction[];
  balance?: number;
  message?: string;
};

export type Transaction = {
  id: string;
  from: string;
  to: string;
  value: number;
  message: string;
  date: string;
  isValid: boolean;
};
