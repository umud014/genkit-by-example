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

import { ScrollArea } from "./ui/scroll-area";
import DemoContext from "./demo-config";
import { Button } from "./ui/button";
import { Play, Sidebar, Newspaper } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import DemoDocs from "./demo-docs";
import { SidebarTrigger } from "./ui/sidebar";

export default function DemoContent({
  id,
  name,
  Config,
  children,
  readme,
  files,
}: {
  id: string;
  name: string;
  Config?: React.ComponentType;
  children: React.ReactNode;
  readme: string;
  files: { name: string; source: string }[];
}) {
  const isMobile = useIsMobile();
  const [showDemo, setShowDemo] = useState(isMobile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isMobile) {
    return (
      <DemoContext>
        <div className="flex">
          <ScrollArea className="overflow-y-auto h-screen ml-2 mr-4 pr-4 flex-shrink">
            <DemoDocs
              id={id}
              name={name}
              Config={Config}
              readme={readme}
              files={files}
            />
          </ScrollArea>
          <div className="flex-1 min-w-[420px]">{children}</div>
        </div>
      </DemoContext>
    );
  }

  return (
    <DemoContext>
      <div className="flex flex-col h-screen">
        {/* Mobile Title Bar */}
        <div className="flex items-center px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <SidebarTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="mr-2"
            >
              <Sidebar className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
          <h1 className="text-xl font-semibold flex-1">{name}</h1>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDemo(false)}
              className={
                !showDemo
                  ? "focus:text-blue-500 text-blue-500"
                  : "text-white/50"
              }
            >
              <Newspaper className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDemo(true)}
              className={
                showDemo
                  ? "focus:text-green-300 text-green-300"
                  : "text-white/50"
              }
            >
              <Play className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden">
          {showDemo ? (
            <div className="h-full">{children}</div>
          ) : (
            <ScrollArea className="h-full px-4">
              <DemoDocs
                id={id}
                name={name}
                Config={Config}
                readme={readme}
                files={files}
                isMobile
              />
            </ScrollArea>
          )}
        </div>
      </div>
    </DemoContext>
  );
}
