import Demo from "@/components/demo";
import ToolCallingChatbotConfig from "./config";
import ToolCallingChatbotApp from "./app";
import { demoMetadata } from "@/lib/demo-metadata";

export const generateMetadata = demoMetadata("tool-calling");

export default async function Page() {
  return (
    <Demo id="tool-calling" Config={ToolCallingChatbotConfig}>
      <ToolCallingChatbotApp />
    </Demo>
  );
}
