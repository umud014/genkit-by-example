"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Send, Sparkle, Trash } from "lucide-react"; // Or any other send icon you prefer
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import DemoConfig from "@/lib/demo-config";
import useAgent from "@/lib/use-agent";
import type { MessageData, Part, Role } from "genkit";

export interface PartRender {
  (message: MessageData, part: Part, index: number): React.ReactNode | null;
}

function TextPart({ role, text }: { role: Role; text: string }) {
  if (text.trim() === "") return <></>;
  return (
    <div
      className={cn(
        "rounded-lg px-4 py-2 max-w-[85%] mb-4", // Allow messages to take up more width
        role === "user"
          ? "bg-zinc-800 border-2 border-zinc-600 text-white ml-auto rounded-tr-none" // User message style, right-aligned
          : "bg-black border-2 border-zinc-700 text-white rounded-tl-none" // Assistant message style, left-aligned
      )}
    >
      <Markdown className="prose prose-sm prose-invert">{text}</Markdown>
    </div>
  );
}

export default function Chat({
  endpoint,
  renderPart: customRenderPart,
}: {
  endpoint: string;
  renderPart?: PartRender;
}) {
  const renderPart: PartRender = (message, part, index) => {
    const custom = customRenderPart?.(message, part, index) || null;
    if (custom !== null) return custom;
    if (part.text) return <TextPart role={message.role} text={part.text} />;
  };

  const { config } = useContext(DemoConfig);
  const {
    messages: rawMessages,
    setMessages,
    error,
    isLoading,
    send,
  } = useAgent({
    endpoint,
  });
  const messages = rawMessages.map((m) => ({
    ...m,
    content: m.content.reduce<Part[]>((out, part) => {
      out;
      if (part.text && out.at(-1)?.text) {
        out.at(-1)!.text += part.text;
      } else {
        out.push(part);
      }
      return out;
    }, []),
  }));

  const [input, setInput] = useState("");
  const bottomOfChat = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomOfChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    console.log("handleSend called");
    return send({
      system: config?.system,
      messages,
      prompt: [{ text: input }],
    });
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
    <div className="flex flex-col h-screen max-w-screen-sm mx-auto relative">
      <ScrollArea className="flex-1 p-4 pt-6 overflow-y-auto">
        {rawMessages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              "flex", // Align items to the start
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.content.map((p, i) => (
              <React.Fragment key={i}>
                {renderPart(message, p, i)}
              </React.Fragment>
            ))}
          </div>
        ))}
        {isLoading && ( //Display loading indicator
          <div className="flex justify-start my-2 ml-16">
            <div className="animate-pulse text-sm">
              The agent is thinking&hellip;
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-lg py-2 px-3 mx-12 my-4 border border-red-300 text-red-100 text-white">
            {error.message}
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
