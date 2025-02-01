import { findDemo } from "@/data";
import { Metadata } from "next";

export function demoMetadata(id: string): () => Promise<Metadata> {
  const demo = findDemo(id);
  return async function () {
    if (!demo) return {};
    return {
      title: demo.name,
      description: demo.description,
    };
  };
}
