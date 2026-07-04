import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, MapPin, Check } from "lucide-react";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "Appointments — GovAssist AI" }] }),
  component: AppointmentsPage,
});

const SLOTS = ["09:00 AM", "10:00 AM", "11:30 AM", "12:30 PM", "02:00 PM", "03:30 PM", "04:30 PM"];

const UPCOMING = [
  {
    id: "APT-01",
    title: "Passport — Biometrics",
    center: "PSK Ameerpet, Hyderabad",
    date: "Fri, 12 Jul 2026",
    time: "11:30 AM",
  },
];

function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ date: Date; slot: string } | null>(null);

  return (
    <AppShell>
      <PageHeader title="Appointments" description="Book a visit at your nearest service centre." badge="Appointments" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-sm mb-3">Pick a date</h3>
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Available slots</h3>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      slot === s ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg border p-3 text-xs text-muted-foreground flex gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">PSK Ameerpet, Hyderabad</div>
                  <div>3rd Floor, Prime Mall, Ameerpet, Hyderabad 500016</div>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                disabled={!date || !slot}
                onClick={() => {
                  setConfirmed({ date: date!, slot: slot! });
                  toast.success("Appointment confirmed");
                }}
              >
                Confirm appointment
              </Button>
            </div>
          </div>

          {confirmed && (
            <div className="mt-6 rounded-xl border bg-secondary/10 p-4 flex items-start gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Appointment confirmed</div>
                <div className="text-sm text-muted-foreground">
                  {confirmed.date.toDateString()} at {confirmed.slot} · PSK Ameerpet
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> Upcoming</h3>
          <div className="mt-4 space-y-3">
            {UPCOMING.map((u) => (
              <div key={u.id} className="rounded-xl border p-4">
                <Badge variant="secondary" className="text-[10px]">Scheduled</Badge>
                <div className="mt-2 font-medium">{u.title}</div>
                <div className="text-xs text-muted-foreground">{u.center}</div>
                <div className="text-sm mt-2 font-medium">{u.date} · {u.time}</div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info("Reschedule flow (mock)")}>Reschedule</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.info("Cancelled (mock)")}>Cancel</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
