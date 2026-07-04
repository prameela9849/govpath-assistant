import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getService, SERVICES } from "@/lib/services-data";

export const Route = createFileRoute("/services/$id")({
  loader: ({ params }) => {
    const svc = getService(params.id);
    if (!svc) throw notFound();
    return { svc };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.svc.name} — GovAssist AI` },
          { name: "description", content: loaderData.svc.description },
        ]
      : [{ title: "Service — GovAssist AI" }],
  }),
  errorComponent: () => <AppShell><div className="text-center py-20 text-sm text-muted-foreground">Failed to load service.</div></AppShell>,
  notFoundComponent: () => (
    <AppShell>
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Service not found</h2>
        <Link to="/services" className="text-primary text-sm hover:underline mt-2 inline-block">← Back to services</Link>
      </div>
    </AppShell>
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { svc } = Route.useLoaderData();
  const related = svc.related.map(getService).filter(Boolean).slice(0, 3);

  return (
    <AppShell>
      <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to services
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8">
            <Badge variant="secondary">{svc.category}</Badge>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{svc.name}</h1>
            <p className="mt-2 text-muted-foreground">{svc.description}</p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <Info label="Processing time" value={svc.processingTime} />
              <Info label="Fee" value={svc.fees} />
              <Info label="Category" value={svc.category} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/apply" search={{ service: svc.id }}>
                <Button className="gap-1">Start application <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <a href={svc.officialUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" className="gap-1">Official portal <ExternalLink className="h-4 w-4" /></Button>
              </a>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold">Eligibility</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {svc.eligibility.map((e) => (
                <li key={e} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" /> {e}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold">Required documents</h3>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {svc.documents.map((d) => (
                <div key={d} className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                  <FileText className="h-4 w-4 text-primary" /> {d}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold">Step-by-step process</h3>
            <ol className="mt-4 space-y-4">
              {svc.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0">
                    {i + 1}
                  </div>
                  <div className="text-sm pt-0.5">{s}</div>
                </li>
              ))}
            </ol>
          </Card>

          {svc.faqs.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold">FAQ</h3>
              <Accordion type="single" collapsible className="mt-2">
                {svc.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`f-${i}`}>
                    <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="p-5 bg-gradient-hero text-primary-foreground border-0">
            <h3 className="font-semibold">Not sure?</h3>
            <p className="text-sm opacity-90 mt-1">Ask the AI assistant in plain language.</p>
            <Link to="/chat"><Button variant="secondary" className="mt-3 w-full">Open Assistant</Button></Link>
          </Card>
          {related.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold">You may also need</h3>
              <div className="mt-3 space-y-2">
                {related.map((r) => (
                  <Link key={r!.id} to="/services/$id" params={{ id: r!.id }} className="block rounded-lg border p-3 hover:border-primary transition-colors">
                    <div className="text-sm font-medium">{r!.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{r!.description}</div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </aside>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _forceInclude = SERVICES;
