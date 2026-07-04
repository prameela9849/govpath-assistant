import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — GovAssist AI" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // TODO: Replace with supabase.auth.signInWithPassword / signUp when Cloud is enabled.
  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Signed in (mock). Welcome to GovAssist AI!");
      navigate({ to: "/dashboard" });
    }, 700);
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="relative hidden md:block bg-gradient-hero">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]" />
        <div className="relative h-full p-12 flex flex-col text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-semibold">GovAssist AI</span>
          </Link>
          <div className="mt-auto">
            <h1 className="text-4xl font-semibold leading-tight">Your government paperwork,<br/>handled by AI.</h1>
            <p className="mt-3 opacity-90 max-w-md">Sign in to continue your applications, review documents, and track approvals.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <Card className="w-full max-w-md p-8 shadow-card-soft">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in or create an account to continue.</p>
          </div>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleAuth} className="space-y-4 mt-4">
                <Field icon={Mail} label="Email" type="email" placeholder="you@example.com" />
                <Field icon={Lock} label="Password" type="password" placeholder="••••••••" />
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-primary hover:underline" onClick={() => toast.info("Password reset link sent (mock)")}>Forgot password?</button>
                </div>
                <Button className="w-full gap-2" disabled={loading}>{loading ? "Signing in…" : "Sign in"} <ArrowRight className="h-4 w-4" /></Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleAuth} className="space-y-4 mt-4">
                <Field icon={User} label="Full name" placeholder="Ananya Sharma" />
                <Field icon={Mail} label="Email" type="email" placeholder="you@example.com" />
                <Field icon={Lock} label="Password" type="password" placeholder="Create a password" />
                <Button className="w-full gap-2" disabled={loading}>{loading ? "Creating…" : "Create account"} <ArrowRight className="h-4 w-4" /></Button>
              </form>
            </TabsContent>
          </Tabs>
          <p className="text-xs text-muted-foreground mt-6 text-center">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type = "text", placeholder }: { icon: React.ComponentType<{ className?: string }>; label: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="relative mt-1">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type={type} placeholder={placeholder} className="pl-9" required />
      </div>
    </div>
  );
}
