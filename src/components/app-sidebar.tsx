"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { demos } from "@/data";
import { BookText, Github, Newspaper } from "lucide-react";

const genkitLinks = [
  {
    url: "https://firebase.google.com/docs/genkit",
    label: "Documentation",
    icon: BookText,
  },
  {
    url: "https://github.com/firebase/genkit",
    label: "GitHub",
    icon: Github,
  },
  {
    url: "https://firebase.blog/category/genkit",
    label: "Blog",
    icon: Newspaper,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex justify-center">
                <Image
                  src="/genkit_logo.png"
                  alt="Firebase Genkit logo"
                  width={36}
                  height={36}
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-xl">
                    Genkit{" "}
                    <span className="text-sm text-sidebar-primary-foreground/60">
                      by Example
                    </span>
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {demos.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `/${item.id}`}
                >
                  <Link href={`/${item.id}`}>{item.name}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {genkitLinks.map((link, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton>
                  <a
                    href={link.url}
                    className="flex items-center"
                    target="_blank"
                  >
                    {<link.icon className="w-4 h-4 mr-1" />}
                    <span>{link.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
