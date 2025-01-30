import Demo from "@/components/demo";
import ToolCallingChatbotConfig from "./config";
import ToolCallingChatbotApp from "./app";

export default async function Page() {
  return (
    <Demo
      name="tool-calling"
      title="Tool Calling"
      Config={ToolCallingChatbotConfig}
    >
      <ToolCallingChatbotApp />
    </Demo>
  );
}
