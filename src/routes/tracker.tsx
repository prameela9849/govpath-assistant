import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock, ExternalLink, FileText } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_APPLICATIONS } from "@/lib/mock-user";
import { getService } from "@/lib/services-data";

export const Route = createFileRoute("/tracker")({
  head: () => ({ meta: [{ title: "Application Tracker — GovAssist AI" }] }),
  component: TrackerPage,
});

function TrackerPage() {
  return (
    <AppShell>
      <PageHeader title="Application Tracker" description="Live status for every application you've submitted." badge="Tracker" />
      <div className="space-y-6">
        {MOCK_APPLICATIONS.map((a) => {
          const svc = getService(a.serviceId);
          return (
            <Card key={a.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{svc?.name}</div>
                      <div className="text-xs text-muted-foreground">{a.id} · Submitted {a.submittedOn}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{a.status}</Badge>
                  {svc && (
                    <a href={svc.officialUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="gap-1">Official <ExternalLink className="h-3.5 w-3.5" /></Button>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Progress value={a.progress} className="h-2 flex-1" />
                <span className="text-xs font-medium w-10 text-right">{a.progress}%</span>
              </div>

              <ol className="space-y-4">
                {a.timeline.map((t, i) => {
                  const isCurrent = !t.done && a.timeline[i - 1]?.done;
                  return (
                    <li key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {t.done ? (
                          <CheckCircle2 className="h-5 w-5 text-secondary" />
                        ) : isCurrent ? (
                          <Clock className="h-5 w-5 text-accent animate-pulse" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/40" />
                        )}
                        {i < a.timeline.length - 1 && <div className={`w-px flex-1 mt-1 ${t.done ? "bg-secondary" : "bg-border"}`} style={{ minHeight: 16 }} />}
                      </div>
                      <div className="pb-2">
                        <div className={`text-sm font-medium ${!t.done && !isCurrent ? "text-muted-foreground" : ""}`}>{t.label}</div>
                        <div className="text-xs text-muted-foreground">{t.date || (isCurrent ? "In progress" : "Pending")}</div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <Link to="/services"><Button variant="outline">Start a new application</Button></Link>
      </div>
    </AppShell>
  );
}
