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

import React, { useEffect, useState } from "react";

export default function CookieNotice({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookieAck, setCookieAckInMem] = useState("");

  useEffect(() => {
    setCookieAckInMem(localStorage.getItem("__cookieAck") || "");
  }, []);

  if (cookieAck === "true") return children;

  return (
    <>
      {children}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center">
        <div className="text-sm bg-background/90 m-2 p-3 rounded-lg flex max-sm:flex-col items-center border border-primary/20">
          <div className="mr-2">
            Genkit by Example uses{" "}
            <a
              href="https://policies.google.com/technologies/cookies"
              className="underline"
              target="_blank"
            >
              cookies
            </a>{" "}
            from Google to deliver and enhance the quality of its services and
            to analyze traffic.
          </div>
          <button
            className="font-bold text-nowrap px-2 py-1 border border-primary/20 rounded"
            onClick={() => {
              window.localStorage.setItem("__cookieAck", "true");
              setCookieAckInMem("true");
            }}
          >
            I understand.
          </button>
        </div>
      </div>
    </>
  );
}
