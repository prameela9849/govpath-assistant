import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SERVICES, CATEGORIES } from "@/lib/services-data";

export const Route = createFileRoute("/services/")({
  head: () => ({ meta: [{ title: "Government Services — GovAssist AI" }] }),
  component: ServicesList,
});

function ServicesList() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const filtered = SERVICES.filter(
    (s) =>
      (!cat || s.category === cat) &&
      (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.description.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <AppShell>
      <PageHeader title="Government Services" description="Browse 15+ services with eligibility, documents, fees and step-by-step process." badge="Catalog" />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCat(null)}
            className={`text-xs rounded-full border px-3 py-1.5 ${!cat ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-xs rounded-full border px-3 py-1.5 ${cat === c ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Card key={s.id} className="p-5 flex flex-col hover:shadow-elegant hover:-translate-y-0.5 transition-all">
            <Badge variant="secondary" className="w-fit text-[10px]">{s.category}</Badge>
            <div className="mt-2 font-semibold">{s.name}</div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-0.5">{s.processingTime}</span>
              <span className="rounded-full bg-muted px-2 py-0.5">{s.fees}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/services/$id" params={{ id: s.id }} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Details</Button>
              </Link>
              <Link to="/apply" search={{ service: s.id }}>
                <Button size="sm" className="gap-1">Apply <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-muted-foreground py-12">No services match.</div>
        )}
      </div>
    </AppShell>
  );
}
