import { moneyMask } from "@/utils/MoneyMask";

type CardProps = {
  friend: {
    name: string;
    username: string;
    balance: number;
  };
};

export default function Card({ friend }: CardProps) {
  const balanceColorVerification =
    friend.balance > 0
      ? "text-[var(--primary-green)]"
      : "text-[var(--primary-red)]";
  const balanceColor =
    friend.balance === 0
      ? "text-[var(--foreground)]"
      : balanceColorVerification;
  return (
    <div className="w-[80%] h-[26%] m-4 bg-[var(--secondary-foreground)] border-[var(--primary-yellow)] border-[0.2rem] rounded-lg">
      <h1 className="font-bold text-[12vw] truncate mx-5">{friend.name}</h1>
      <h2 className="mb-2">{friend.username}</h2>
      <h2 className="text-[7vw]">Saldo</h2>
      <h2 className={`text-[8vw] font-bold ${balanceColor}`}>
        {moneyMask(friend.balance)}
      </h2>
    </div>
  );
}
