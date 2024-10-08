export type InputProps = {
  css?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ css, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={`m-4 p-2 focus:bg-[var(--secondary-foreground)] outline-none border-[1px] rounded-lg border-[var(--foreground)] bg-[var(--background)] ${css}`}
    />
  );
}
