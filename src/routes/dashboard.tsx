import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageSquare,
  Upload,
  ClipboardList,
  CalendarClock,
  ArrowRight,
  TrendingUp,
  FileText,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MOCK_USER, MOCK_APPLICATIONS, MOCK_NOTIFICATIONS } from "@/lib/mock-user";
import { getService, SERVICES } from "@/lib/services-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — GovAssist AI" }] }),
  component: Dashboard,
});

const QUICK_ACTIONS = [
  { to: "/chat", label: "Ask Assistant", icon: MessageSquare, color: "bg-primary/10 text-primary" },
  { to: "/documents", label: "Upload Docs", icon: Upload, color: "bg-secondary/20 text-secondary-foreground" },
  { to: "/tracker", label: "Track Status", icon: ClipboardList, color: "bg-accent/20 text-accent-foreground" },
  { to: "/appointments", label: "Appointments", icon: CalendarClock, color: "bg-primary/10 text-primary" },
] as const;

function Dashboard() {
  const recommended = SERVICES.slice(0, 4);
  return (
    <AppShell>
      <PageHeader
        title={`Welcome back, ${MOCK_USER.name.split(" ")[0]}`}
        description="Here's a snapshot of your applications, documents and next steps."
        badge="Dashboard"
        action={
          <Link to="/chat">
            <Button className="gap-2"><MessageSquare className="h-4 w-4" /> New Chat</Button>
          </Link>
        }
      />

      {/* Welcome / Quick actions */}
      <div className="grid gap-4 md:grid-cols-4">
        {QUICK_ACTIONS.map((a) => (
          <Link key={a.to} to={a.to}>
            <Card className="p-5 h-full hover:shadow-elegant hover:-translate-y-0.5 transition-all">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${a.color}`}>
                <a.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 font-semibold">{a.label}</div>
              <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">Open <ArrowRight className="h-3 w-3" /></div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 mt-6 lg:grid-cols-3">
        {/* Continue previous */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Continue your applications</h3>
              </div>
              <p className="text-sm text-muted-foreground">Pick up where you left off.</p>
            </div>
            <Link to="/tracker"><Button variant="ghost" size="sm">View all</Button></Link>
          </div>
          <div className="mt-4 space-y-3">
            {MOCK_APPLICATIONS.map((a) => {
              const svc = getService(a.serviceId);
              return (
                <div key={a.id} className="flex items-center gap-4 rounded-xl border p-4 hover:bg-muted/40 transition-colors">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{svc?.name}</div>
                      <Badge variant="outline" className="text-[10px]">{a.id}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <Progress value={a.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground w-8 text-right">{a.progress}%</span>
                    </div>
                  </div>
                  <Badge>{a.status}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="mt-4 space-y-3">
            {MOCK_NOTIFICATIONS.map((n) => (
              <div key={n.id} className="flex gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.unread ? "bg-primary" : "bg-muted-foreground/30"}`} />
                <div className="min-w-0">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.body}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommended services */}
      <div className="mt-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h3 className="font-semibold">Recommended for you</h3>
            <p className="text-sm text-muted-foreground">Based on your recent activity.</p>
          </div>
          <Link to="/services"><Button variant="ghost" size="sm">Browse all</Button></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((s) => (
            <Link key={s.id} to="/services/$id" params={{ id: s.id }}>
              <Card className="p-5 h-full hover:border-primary transition-colors">
                <Badge variant="secondary" className="text-[10px]">{s.category}</Badge>
                <div className="mt-2 font-medium">{s.name}</div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{s.description}</p>
                <div className="mt-3 flex items-center text-xs text-muted-foreground gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> {s.processingTime}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
