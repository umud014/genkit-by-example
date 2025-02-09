/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use client";
import React, { useContext } from "react";
import Chat from "@/components/chat";
import { Sun, Cloud, CloudRain, CloudSnow } from "lucide-react";
import Dice from "./dice-roll";
import DemoConfig from "@/lib/demo-config";
import CodeBlock from "@/components/code-block";

export default function ActionContextDemoApp() {
  const { config } = useContext(DemoConfig);

  return (
    <Chat
      endpoint="/action-context/api"
      renderPart={(part, info) => {
        if (info.message.role === "system") return <></>;
        switch (part.toolResponse?.name) {
          case "sendMessage":
            return (
              <CodeBlock source={JSON.stringify(part.toolResponse, null, 2)} />
            );
        }
        return null;
      }}
      data={
        /* in a real application, client should not set context */
        { context: { auth: config?.user } }
      }
    />
  );
}
