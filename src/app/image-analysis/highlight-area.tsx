import React from "react";

interface Bounds {
  box2d: number[];
  colors?: string[];
}

const HighlightArea: React.FC<{ bounds?: Bounds }> = ({ bounds }) => {
  if (!bounds) return;
  const [yMin, xMin, yMax, xMax] = bounds?.box2d || [];
  return (
    <div
      className={`absolute ${
        bounds ? "opacity-100" : "opacity-0"
      } pointer-events-none transition-all border-4 border-red-500 rounded-xl`}
      style={
        bounds && {
          left: `${xMin / 10}%`,
          top: `${yMin / 10}%`,
          right: `${(1000 - xMax) / 10}%`,
          bottom: `${(1000 - yMax) / 10}%`,
          borderColor: bounds.colors ? bounds.colors[0] : "red",
          boxShadow: "0 0 10px black",
        }
      }
    />
  );
};

export default HighlightArea;
