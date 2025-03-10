import React from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  Home,
  Music,
  Video,
  BookOpen,
  Settings,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/ui/theme-provider";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const { theme, setTheme } = useTheme() || {
    theme: "dark",
    setTheme: () => {},
  };

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Home",
      path: "/",
    },
    {
      icon: <Music className="h-5 w-5" />,
      label: "Music Player",
      path: "/music",
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: "Social Media Processor",
      path: "/social",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Islamic Features",
      path: "/islamic",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex h-full w-[280px] flex-col bg-background border-r p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="rounded-full bg-primary/10 p-1">
          <Music className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold">Islamic Audio</h1>
      </div>

      <Separator className="my-4" />

      <nav className="flex-1 space-y-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
              )
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-lg bg-accent/50 p-4">
          <h3 className="mb-2 font-medium">Offline Mode</h3>
          <p className="text-sm text-muted-foreground">
            Download your favorite tracks for offline listening
          </p>
          <Button className="mt-3 w-full" size="sm">
            Manage Downloads
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=islamic-audio" />
              <AvatarFallback>IA</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">User</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" title="Log out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
