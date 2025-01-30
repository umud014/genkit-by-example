"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import DemoConfig from "@/lib/demo-config";
import { Label } from "@radix-ui/react-label";
import { useContext } from "react";

export default function ToolCallingChatbotConfig() {
  const { config, setConfig } = useContext(DemoConfig);

  return (
    <Card>
      <CardContent>
        <Label htmlFor="form-system" className="mt-3 mb-2 block">
          Custom System Message
        </Label>
        <Textarea
          placeholder="You are a helpful assistant. Try to answer the user's queries to the best of your ability."
          value={config?.system?.[0]?.text}
          id="form-system"
          name="system"
          onInput={(e) => {
            setConfig?.({
              system: [{ text: (e.target as HTMLTextAreaElement).value }],
            });
          }}
        />
      </CardContent>
    </Card>
  );
}
