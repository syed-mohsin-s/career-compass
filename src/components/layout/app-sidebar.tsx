"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  Briefcase,
  BookOpen,
  Target,
  ClipboardList,
  MessageSquare,
  GitGraph,
  FlaskConical,
  Bot,
  Compass,
  Trophy,
  Users,
  LogOut,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/skill-profile", label: "Skill Profile", icon: User },
  { href: "/career-paths", label: "Career Paths", icon: Briefcase },
  { href: "/learning-plan", label: "Learning Plan", icon: BookOpen },
  { href: "/job-prep", label: "Job Prep", icon: ClipboardList },
  { href: "/mock-interview", label: "Mock Interview", icon: MessageSquare },
  { href: "/skill-tree", label: "Skill Tree", icon: GitGraph },
  { href: "/simulator", label: "What-If Simulator", icon: FlaskConical },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Compass className="text-primary h-8 w-8" />
            <h1 className="text-xl font-headline font-bold">Career Compass</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: "right" }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
          <div className="p-4 flex items-center gap-3">
             <Avatar>
                <AvatarImage src="https://picsum.photos/seed/1/40/40" data-ai-hint="person face" />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-semibold text-sm">Jane Doe</span>
                <span className="text-xs text-muted-foreground">jane.doe@example.com</span>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={{ children: "Settings", side: "right" }}>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={{ children: "Log out", side: "right" }}>
                <LogOut />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
