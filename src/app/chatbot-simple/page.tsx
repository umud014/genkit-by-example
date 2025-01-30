import Demo from "@/components/demo";
import SimpleChatbotConfig from "./config";
import Chat from "@/components/chat";

export default async function Page() {
  return (
    <Demo
      name="chatbot-simple"
      title="Simple Chatbot"
      Config={SimpleChatbotConfig}
    >
      <Chat endpoint="/chatbot-simple/api" />
    </Demo>
  );
}
