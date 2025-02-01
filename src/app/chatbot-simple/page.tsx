import Demo from "@/components/demo";
import SimpleChatbotConfig from "./config";
import Chat from "@/components/chat";
import { demoMetadata } from "@/lib/demo-metadata";

export const generateMetadata = demoMetadata("chatbot-simple");

export default async function Page() {
  return (
    <Demo id="chatbot-simple" Config={SimpleChatbotConfig}>
      <Chat endpoint="/chatbot-simple/api" />
    </Demo>
  );
}
