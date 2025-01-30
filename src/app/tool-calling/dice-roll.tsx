import React from "react";

const pips = {
  1: [{ className: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" }],
  2: [{ className: "top-0 left-0" }, { className: "bottom-0 right-0" }],
  3: [
    { className: "top-0 left-0" },
    { className: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
    { className: "bottom-0 right-0" },
  ],
  4: [
    { className: "top-0 left-0" },
    { className: "top-0 right-0" },
    { className: "bottom-0 left-0" },
    { className: "bottom-0 right-0" },
  ],
  5: [
    { className: "top-0 left-0" },
    { className: "top-0 right-0" },
    { className: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
    { className: "bottom-0 left-0" },
    { className: "bottom-0 right-0" },
  ],
  6: [
    { className: "top-0 left-0" },
    { className: "top-0 right-0" },
    { className: "top-1/2 -translate-y-1/2 left-0" },
    { className: "top-1/2 -translate-y-1/2 right-0" },
    { className: "bottom-0 left-0" },
    { className: "bottom-0 right-0" },
  ],
};

interface DieProps {
  value: number;
  className?: string;
}

export default function Dice({ value, className = "" }: DieProps) {
  return (
    <div className="h-16 w-16 rounded-md from-red-500 to-red-700 bg-gradient-to-br p-2 my-2">
      <div className={`relative w-full h-full ${className}`}>
        {pips[value as keyof typeof pips].map((pip, i) => (
          <span
            key={i}
            className={`absolute h-3 w-3 rounded-full bg-white ${pip.className}`}
          />
        ))}
      </div>
    </div>
  );
}
