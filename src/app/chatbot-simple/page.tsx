import Demo from "@/components/demo";
import SimpleChatbotApp from "./app";
import { Metadata } from "next";
import SimpleChatbotConfig from "./config";

export const metadata: Metadata = {
  title: "Genkit by Example: Simple Chatbot",
  description: "A simple chatbot with customizable system message built using Genkit.",
};

export default async function Page() {
  return (
    <Demo name="chatbot-simple" title="Simple Chatbot" Config={SimpleChatbotConfig}>
      <SimpleChatbotApp />
    </Demo>
  );
}
