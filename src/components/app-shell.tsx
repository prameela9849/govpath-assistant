import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquare,
  FileStack,
  Upload,
  ClipboardList,
  CalendarClock,
  User,
  Sparkles,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LanguagePicker } from "./language-picker";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "AI Assistant", icon: MessageSquare },
  { to: "/services", label: "Services", icon: FileStack },
  { to: "/documents", label: "Documents", icon: Upload },
  { to: "/tracker", label: "Tracker", icon: ClipboardList },
  { to: "/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="flex h-16 items-center gap-3 px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero shadow-elegant">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">GovAssist AI</div>
              <div className="text-[11px] text-muted-foreground -mt-0.5">Government Service Assistant</div>
            </div>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <LanguagePicker />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
            </Button>
            <Link to="/profile">
              <div className="h-9 w-9 rounded-full bg-gradient-hero grid place-items-center text-primary-foreground text-sm font-medium">
                AS
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed md:sticky md:top-16 top-16 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-sidebar transition-transform md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <nav className="flex h-full flex-col gap-1 p-3">
            {NAV.map((item) => {
              const active = pathname === item.to || pathname.startsWith(item.to + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-elegant"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-auto rounded-xl border bg-card p-3">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                AI-powered
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Ask anything about government services in your language.
              </p>
              <Link to="/chat">
                <Button size="sm" className="mt-2 w-full">Open Assistant</Button>
              </Link>
            </div>
          </nav>
        </aside>

        {open && <div className="fixed inset-0 top-16 z-20 bg-black/30 md:hidden" onClick={() => setOpen(false)} />}

        {/* Main */}
        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  badge,
  action,
}: {
  title: string;
  description?: string;
  badge?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {badge && (
          <Badge variant="secondary" className="mb-2">
            {badge}
          </Badge>
        )}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}
