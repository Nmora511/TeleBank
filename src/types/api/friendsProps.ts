export type friends = {
  name: string;
  username: string;
  balance: number;
};

export type friendsProps = {
  friends?: friends[];
  message?: string;
};
