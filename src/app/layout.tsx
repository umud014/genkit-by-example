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

import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import WithFirebase from "./firebase";
import CookieNotice from "./cookie-notice";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Genkit by Example",
    default: "Genkit by Example",
  },
  description:
    "Common patterns for apps incorporating GenAI, powered by Firebase Genkit.",
};

function App({ children }: { children: React.ReactNode }) {
  return (
    <WithFirebase>
      <AppSidebar />
      <div className="flex-1">{children}</div>
    </WithFirebase>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="9JWnKEasD_LoBLFjpoJoktCbS8P4kYoV3HxbSDL0XBU"
        />
      </head>
      <body className={`${nunitoSans.className} antialiased dark`}>
        <SidebarProvider>
          <CookieNotice>
            <App>{children}</App>
          </CookieNotice>
        </SidebarProvider>
      </body>
    </html>
  );
}
