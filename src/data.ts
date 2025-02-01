import { notFound } from "next/navigation";

export interface DemoMetadata {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  added?: string;
  complexity?: number;
}

export const demos: DemoMetadata[] = [
  {
    id: "chatbot-simple",
    name: "Simple Chatbot",
    description:
      "A simple chatbot with streaming responses and a customizable system message.",
    tags: ["chat"],
    added: "2025-01-27",
    complexity: 1,
  },
  {
    id: "structured-output",
    name: "Structured Output",
    description:
      "A D&D character generator that utilizes Genkit's structured output with incremental streaming.",
    tags: ["structured-output"],
    added: "2025-01-28",
    complexity: 1,
  },
  {
    id: "tool-calling",
    name: "Tool Calling",
    description:
      "A simple example of a tool-calling chatbot that uses a getWeather tool with fake data and a rollDice tool that renders a red die with pips. This demo uses tool calling.",
    tags: ["tools", "chat"],
    complexity: 2,
  },
];

export function findDemo(id: string): DemoMetadata | undefined {
  return demos.find((d) => d.id === id);
}

export function mustFindDemo(id: string): DemoMetadata {
  const demo = findDemo(id);
  if (!demo) notFound();
  return demo;
}
