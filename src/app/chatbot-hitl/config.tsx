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

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import DemoConfig from "@/lib/demo-config";
import { Label } from "@radix-ui/react-label";
import { useContext } from "react";
import { DEFAULT_SYSTEM_MESSAGE } from "./constants";

export default function HitlChatbotConfig() {
  const { config, setConfig } = useContext(DemoConfig);

  return (
    <Card>
      <CardContent>
        <Label htmlFor="form-system" className="mt-3 mb-2 block">
          Custom System Message
        </Label>
        <Textarea
          placeholder={DEFAULT_SYSTEM_MESSAGE}
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
