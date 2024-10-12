export type NotificationProps = {
  invites?: string[];
  transactions?: transaction[];
  message?: string;
};

export type transaction = {
  from: string;
  to: string;
  value: number;
  message: string;
  date: string;
  isValid: boolean;
  id: string;
};
