"use client";

import { ReactNode, useEffect } from "react";

type ScrollableWrapperProps = {
  children: ReactNode;
};

const ScrollableWrapper = ({ children }: ScrollableWrapperProps) => {
  useEffect(() => {
    const scrollable = document.querySelector(".scrollable");

    const handleTouchMove = (event: TouchEvent) => {
      if (scrollable && !scrollable.contains(event.target as Node)) {
        event.preventDefault();
      }
    };

    document.body.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      document.body.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return <div className="scrollable">{children}</div>;
};

export default ScrollableWrapper;
