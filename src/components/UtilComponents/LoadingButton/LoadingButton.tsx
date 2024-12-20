import { motion, MotionProps } from "framer-motion";
import ThreeDotsWave from "./ThreeDotsWave";

type ButtonProps = {
  isLoadingButton: boolean;
  css?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps;

export default function LoadingButton({
  css,
  isLoadingButton,
  children,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      {...rest}
      disabled={isLoadingButton}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`bg-[var(--primary-yellow)] mb-4 hover:bg-[var(--secondary-yellow)] active:bg-[var(--tertiary-yellow)] font-bold p-4 rounded-2xl ${css}`}
    >
      {isLoadingButton ? <ThreeDotsWave /> : children}
    </motion.button>
  );
}
