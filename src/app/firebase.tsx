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

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/lib/firebase";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logEvent } from "@/lib/firebase";

const queryClient = new QueryClient();

export default function WithFirebase({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useEffect(() => {
    logEvent("screen_view", { firebase_screen: pathname });
  }, [pathname]);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
