import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, User, Bell, Shield, Palette, Globe, FileText } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LanguagePicker } from "@/components/language-picker";
import { MOCK_USER, MOCK_APPLICATIONS } from "@/lib/mock-user";
import { getService } from "@/lib/services-data";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — GovAssist AI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <AppShell>
      <PageHeader title="Profile & Settings" description="Manage your identity, preferences and saved data." badge="Account" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-hero text-primary-foreground text-xl font-semibold">
              AS
            </div>
            <div>
              <div className="font-semibold text-lg">{MOCK_USER.name}</div>
              <div className="text-sm text-muted-foreground">{MOCK_USER.email}</div>
            </div>
            <Button variant="outline" className="ml-auto" onClick={() => toast.info("Edit profile (mock)")}>Edit</Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <ReadField label="Full name" value={MOCK_USER.name} />
              <ReadField label="Date of birth" value={MOCK_USER.dob} />
              <ReadField label="Mobile" value={MOCK_USER.phone} />
              <ReadField label="Aadhaar" value={MOCK_USER.aadhaar} />
              <div className="sm:col-span-2"><ReadField label="Address" value={MOCK_USER.address} /></div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" /> Saved applications
            </h3>
            <div className="space-y-2">
              {MOCK_APPLICATIONS.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div>
                    <div className="font-medium">{getService(a.serviceId)?.name}</div>
                    <div className="text-xs text-muted-foreground">{a.id}</div>
                  </div>
                  <Badge>{a.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-2"><Palette className="h-4 w-4" /> Appearance</h3>
            <div className="mt-4 flex items-center justify-between">
              <Label htmlFor="dark">Dark mode</Label>
              <Switch id="dark" checked={dark} onCheckedChange={setDark} />
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-2"><Globe className="h-4 w-4" /> Language</h3>
            <div className="mt-3"><LanguagePicker /></div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</h3>
            <div className="mt-3 space-y-3 text-sm">
              <Row label="Application updates" defaultOn />
              <Row label="Appointment reminders" defaultOn />
              <Row label="Recommended services" />
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-2"><Shield className="h-4 w-4" /> Privacy & Security</h3>
            <div className="mt-3 space-y-2 text-sm">
              <Button variant="outline" className="w-full justify-start">Change password</Button>
              <Button variant="outline" className="w-full justify-start">Download my data</Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">Delete account</Button>
            </div>
          </Card>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => {
              toast.success("Signed out");
              navigate({ to: "/" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input className="mt-1" defaultValue={value} readOnly />
    </div>
  );
}

function Row({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}
