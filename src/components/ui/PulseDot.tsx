import React from "react";

const PulseDot = () => {
  return (
    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75"></span>
    </span>
  );
};

export default PulseDot;
