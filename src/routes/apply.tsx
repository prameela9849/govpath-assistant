import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getService } from "@/lib/services-data";
import { MOCK_USER } from "@/lib/mock-user";
import { toast } from "sonner";
import { saveApplication } from "@/services/application";

const searchSchema = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/apply")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Apply — GovAssist AI" }] }),
  component: ApplyPage,
});

function ApplyPage() {
  const { service: serviceId } = Route.useSearch();
  const navigate = useNavigate();
  const svc = serviceId ? getService(serviceId) : undefined;
  const [form, setForm] = useState({
    fullName: MOCK_USER.name,
    dob: MOCK_USER.dob,
    gender: MOCK_USER.gender,
    email: MOCK_USER.email,
    phone: MOCK_USER.phone,
    address: MOCK_USER.address,
    fatherName: MOCK_USER.fatherName,
    motherName: MOCK_USER.motherName,
    aadhaar: MOCK_USER.aadhaar,
    pan: MOCK_USER.pan,
  });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
  e.preventDefault();

  setSubmitting(true);

  try {

    await saveApplication({
      service_name: svc?.name || "Unknown Service",
      form_data: form,
      status: "Submitted",
    });

    toast.success("Application Submitted Successfully!");

    navigate({
      to: "/tracker",
    });

  } catch (err) {

    console.error(err);

    toast.error("Unable to submit application");

  } finally {

    setSubmitting(false);

  }
}
  return (
    <AppShell>
      <PageHeader
        title={svc ? `Apply for ${svc.name}` : "Apply"}
        description="We've pre-filled fields from your verified documents. Review and edit before submitting."
        badge={svc?.category ?? "Application"}
        action={
          <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Auto-filled by AI
          </div>
        }
      />

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2 space-y-6">
          <Section title="Personal Information">
            <Field label="Full name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
            <Field label="Date of birth" type="date" value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} />
            <Field label="Gender" value={form.gender} onChange={(v) => setForm({ ...form, gender: v })} />
            <Field label="Father's name" value={form.fatherName} onChange={(v) => setForm({ ...form, fatherName: v })} />
            <Field label="Mother's name" value={form.motherName} onChange={(v) => setForm({ ...form, motherName: v })} />
          </Section>
          <Section title="Contact">
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Mobile number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <div className="sm:col-span-2">
              <Label className="text-xs">Address</Label>
              <Textarea className="mt-1" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} />
            </div>
          </Section>
          <Section title="Identity (masked)">
            <Field label="Aadhaar number" value={form.aadhaar} onChange={(v) => setForm({ ...form, aadhaar: v })} />
            <Field label="PAN number" value={form.pan} onChange={(v) => setForm({ ...form, pan: v })} />
          </Section>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline">Save draft</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit application"}</Button>
          </div>
        </Card>

        <aside className="space-y-4">
          {svc && (
            <Card className="p-5">
              <Badge variant="secondary" className="text-[10px]">{svc.category}</Badge>
              <div className="mt-1 font-semibold">{svc.name}</div>
              <p className="text-xs text-muted-foreground">{svc.description}</p>
              <div className="mt-3 text-xs space-y-1">
                <div><span className="text-muted-foreground">Processing:</span> <b>{svc.processingTime}</b></div>
                <div><span className="text-muted-foreground">Fee:</span> <b>{svc.fees}</b></div>
              </div>
            </Card>
          )}
          <Card className="p-5">
            <h3 className="font-semibold text-sm">Documents attached</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {["Aadhaar", "PAN Card", "Passport-size Photo"].map((d) => (
                <li key={d} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-secondary" /> {d}
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </form>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input className="mt-1" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
