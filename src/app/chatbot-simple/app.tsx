"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ellipsis, Send } from "lucide-react"; // Or any other send icon you prefer
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { applyChunk, cn, postAndStreamJSON } from "@/lib/utils"; // Import cn for class name merging
import type { MessageData } from "genkit";
import { SimpleChatbotRequest } from "./schema.js";
import { GenerateResponseChunkData } from "genkit/model";
import Markdown from "react-markdown";
import DemoConfig from "@/lib/demo-config";

export default function SimpleChatbotApp() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [pendingMessages, setPendingMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomOfChat = useRef<HTMLDivElement>(null);
  const { config } = useContext(DemoConfig);

  useEffect(() => {
    if (!isLoading && pendingMessages.length) {
      setMessages((messages) => [...messages, ...pendingMessages]);
      setPendingMessages([]);
    }
  }, [isLoading, pendingMessages]);

  useEffect(() => {
    bottomOfChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingMessages]);

  const sendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    const newMessage: MessageData = {
      role: "user",
      content: [{ text: input }],
    };

    setMessages([...messages, newMessage]);
    setInput(""); // Clear input immediately
    setIsLoading(true);

    try {
      // Simulate an API call to your AI assistant. Replace with your actual API endpoint.
      const stream = await postAndStreamJSON<SimpleChatbotRequest, GenerateResponseChunkData>(
        "/chatbot-simple/api",
        {
          history: messages,
          content: newMessage.content,
          system: config?.system,
        }
      );
      for await (const chunk of stream) {
        console.log(chunk.role, chunk.index, chunk.content);
        applyChunk(chunk, setPendingMessages);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: MessageData = {
        role: "model",
        content: [{ text: "Sorry, something went wrong. Please try again." }],
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Send on Enter, not Shift+Enter
      e.preventDefault(); // Prevent newline in the input
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-screen-md mx-auto">
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        {[...messages, ...pendingMessages].map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex w-full my-4 items-start", // Align items to the start
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "model" && (
              <Avatar className="mr-2">
                <AvatarImage src="/placeholder-avatar-assistant.jpg" alt="Assistant Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[70%]", // Limit message width
                message.role === "user"
                  ? "bg-zinc-800 border-2 border-zinc-600 text-white ml-auto rounded-tr-none" // User message style, right-aligned
                  : "bg-black border-2 border-zinc-700 text-white rounded-tl-none" // Assistant message style, left-aligned
              )}
            >
              <Markdown className="prose prose-sm prose-invert">
                {message.content.map((p) => p.text).join("")}
              </Markdown>
            </div>

            {message.role === "user" && (
              <Avatar className="ml-2">
                <AvatarImage src="/placeholder-avatar-user.jpg" alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && ( //Display loading indicator
          <div className="flex justify-start my-2 ml-16">
            <div className="animate-pulse text-sm">The agent is thinking&hellip;</div>
          </div>
        )}
        <div ref={bottomOfChat} />
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 flex items-center">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Handle Enter key
          className="mr-2"
          disabled={isLoading}
        />
        <Button variant="ghost" size="icon" onClick={sendMessage} disabled={isLoading}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
