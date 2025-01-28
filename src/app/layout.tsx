import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Genkit Patterns",
  description: "Common patterns for apps incorporating GenAI, powered by Firebase Genkit.",
};

function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <div className="flex-1 mr-2">{children}</div>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.className} antialiased dark`}>
        <SidebarProvider>
          <App>{children}</App>
        </SidebarProvider>
      </body>
    </html>
  );
}
