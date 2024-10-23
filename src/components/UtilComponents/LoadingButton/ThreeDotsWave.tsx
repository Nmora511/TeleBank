import React from "react";
import { motion } from "framer-motion";

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const loadingCircleVariants = {
  start: {
    y: "50%",
  },
  end: {
    y: "150%",
  },
};

const loadingCircleTransition = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: "reverse" as const,
  ease: "easeInOut",
};

export default function ThreeDotsWave({
  circleCss,
  containerCss,
}: {
  circleCss?: string;
  containerCss?: string;
}) {
  const loadingCircle = `block w-[0.5rem] h-[0.5rem] bg-[var(--foreground)] rounded ${circleCss}`;
  return (
    <motion.div
      className={`flex w-[4.5rem] h-[1.4rem] justify-evenly ${containerCss}`}
      variants={loadingContainerVariants}
      initial="start"
      animate="end"
    >
      <motion.span
        className={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        className={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        className={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
    </motion.div>
  );
}
