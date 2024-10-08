"use client";
import { useState } from "react";
import Input from "./Input";
import { InputProps } from "./Input";

export default function InputPassword({ ...rest }: InputProps) {
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);

  return (
    <div className="relative">
      <Input type={passwordHidden ? "password" : "text"} {...rest} />
      <button
        type="button"
        onClick={() => {
          setPasswordHidden(!passwordHidden);
        }}
        className={`absolute inset-y-0 end-0 flex items-center z-20 px-8 cursor-pointer rounded-e-md focus:outline-none ${
          passwordHidden
            ? "text-[var(--foreground)]"
            : "text-[var(--primary-yellow)]"
        }`}
      >
        {passwordHidden ? (
          <svg
            className="shrink-0 size-3.5"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
            <line x1="2" y1="2" x2="22" y2="22"></line>
          </svg>
        ) : (
          <svg
            className="shrink-0 size-3.5"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        )}
      </button>
    </div>
  );
}
