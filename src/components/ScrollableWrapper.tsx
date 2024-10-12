"use client";

import { useEffect } from "react";

const ScrollableWrapper = () => {
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
  return <></>;
};

export default ScrollableWrapper;
