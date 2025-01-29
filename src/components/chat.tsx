"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Send, Sparkle, Trash } from "lucide-react"; // Or any other send icon you prefer
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import DemoConfig from "@/lib/demo-config";
import useAgent from "@/lib/use-agent";

export default function Chat({ endpoint }: { endpoint: string }) {
  const { config } = useContext(DemoConfig);
  const { messages, setMessages, error, isLoading, send } = useAgent({ endpoint });
  const [input, setInput] = useState("");
  const bottomOfChat = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomOfChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    return send({ system: config?.system, messages, prompt: [{ text: input }] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in the input
      if (isLoading) return;
      handleSend();
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-screen-md mx-auto relative">
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        {[...messages].map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex w-full my-4 items-start", // Align items to the start
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "model" && (
              <Avatar className="mr-2">
                <AvatarFallback>
                  <Sparkle />
                </AvatarFallback>
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
          ref={inputRef}
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Handle Enter key
          className="mr-2"
          disabled={isLoading}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (isLoading) return;
            handleSend();
            inputRef.current?.focus();
          }}
          disabled={isLoading}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
      {messages.length > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 left-2"
          title="Reset Conversation"
          onClick={() => {
            setMessages([]);
            inputRef.current?.focus();
          }}
        >
          <RefreshCcw />
        </Button>
      )}
    </div>
  );
}
