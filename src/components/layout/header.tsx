"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Search, Moon, Sun } from "lucide-react";
import { Input } from "../ui/input";
import { useTheme } from "@/hooks/use-theme";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const formatPathname = (pathname: string) => {
  if (pathname === "/") return "Dashboard";
  return pathname
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part
        .split("-")
        .map((word) => capitalize(word))
        .join(" ")
    )
    .join(" / ");
};

export function Header() {
  const pathname = usePathname();
  const title = formatPathname(pathname);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-20 items-center gap-4 border-b bg-card/50 px-4 md:px-6 sticky top-0 z-30 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-xl font-semibold md:text-2xl">
          {title}
        </h1>
      </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background/50"
            />
          </div>
        </form>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
