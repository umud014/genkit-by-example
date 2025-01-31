"use client";
import React from "react";
import Chat from "@/components/chat";
import { Sun, Cloud, CloudRain, CloudSnow } from "lucide-react";
import Dice from "./dice-roll";

function WeatherResponse({
  temperature,
  condition,
}: {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
}) {
  let icon: React.ReactNode = <Sun />;
  switch (condition) {
    case "cloudy":
      icon = <Cloud />;
      break;
    case "rainy":
      icon = <CloudRain />;
      break;
    case "snowy":
      icon = <CloudSnow />;
      break;
  }

  return (
    <div className=" mb-4 border-2 border-zinc-700 p-4 pb-3 rounded-xl">
      <div className="flex items-center gap-2">
        <span className="text-xl">{temperature}°F</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-xs text-primary/50 text-center mt-1">(not real)</div>
    </div>
  );
}

function DiceResponse({ output }: { output: number }) {
  const [number, setNumber] = React.useState(output);
  const [rolling, setRolling] = React.useState(true);

  React.useEffect(() => {
    if (!rolling) return;
    const rolls = Array.from({ length: 10 }, (_, i) =>
      setTimeout(() => setNumber(Math.floor(Math.random() * 6) + 1), i * 100)
    );
    setTimeout(() => {
      setRolling(false);
      setNumber(output);
    }, 1000);
    return () => rolls.forEach(clearTimeout);
  }, [output]);

  return (
    <Dice
      value={number}
      className={"mb-4" + (rolling ? "animate-shake" : "")}
    />
  );
}

export default function ToolCallingChatbotApp() {
  return (
    <Chat
      endpoint="/tool-calling/api"
      renderPart={(message, part) => {
        if (part.toolResponse?.name === "getWeather")
          return <WeatherResponse {...(part.toolResponse.output as any)} />;
        if (part.toolResponse?.name === "rollDice")
          return <DiceResponse output={part.toolResponse.output as any} />;
        return null;
      }}
    />
  );
}
