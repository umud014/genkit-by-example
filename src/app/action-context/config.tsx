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

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DemoConfig from "@/lib/demo-config";
import { Label } from "@radix-ui/react-label";
import { useContext } from "react";
import { ANIMAL_USERS } from "./data";

export default function ActionContextDemoConfig() {
  const { config, setConfig } = useContext(DemoConfig);

  return (
    <Card>
      <CardContent>
        <Label className="mt-3 mb-2 block text-center font-semibold">
          Choose Your User
        </Label>
        <div className="flex space-x-2 justify-center flex-wrap">
          <Button
            key={"none"}
            variant="outline"
            className={!config?.user ? "bg-red-600/20 border-red-400" : ""}
            onClick={() => setConfig?.({ user: null })}
          >
            🚫 None
          </Button>
          {ANIMAL_USERS.map((user) => (
            <Button
              key={user.uid}
              variant="outline"
              className={
                config?.user?.uid === user.uid
                  ? "border-blue-400 bg-blue-400/20"
                  : ""
              }
              onClick={() => setConfig?.({ user })}
            >
              {user.emoji} {user.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
