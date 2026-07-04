import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  MessageSquare,
  Upload,
  ClipboardList,
  CalendarClock,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
  IdCard,
  Car,
  BookMarked,
  GraduationCap,
  HeartPulse,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LanguagePicker } from "@/components/language-picker";

export const Route = createFileRoute("/")({
  component: Landing,
});

const FEATURES = [
  { icon: MessageSquare, title: "AI Chat Assistant", desc: "Ask in your language — get eligibility, docs, fees and next steps." },
  { icon: Upload, title: "Smart Document Verification", desc: "OCR extracts fields from Aadhaar, PAN and more and validates instantly." },
  { icon: Zap, title: "Auto-filled Forms", desc: "We pre-fill applications from your verified documents. You only review." },
  { icon: ClipboardList, title: "Application Tracker", desc: "Live timeline for every application, with notifications at each stage." },
  { icon: CalendarClock, title: "Appointment Booking", desc: "Book, reschedule or cancel visits to service centres in a few taps." },
  { icon: ShieldCheck, title: "Secure & Private", desc: "Data encrypted at rest. You control what is shared and with whom." },
];

const STEPS = [
  { n: "01", title: "Tell the assistant what you need", desc: "e.g. 'I want a caste certificate'" },
  { n: "02", title: "Upload your documents", desc: "OCR validates and detects missing proofs" },
  { n: "03", title: "Review the auto-filled form", desc: "Edit anything before submission" },
  { n: "04", title: "Book appointment & track", desc: "Live status until it's approved" },
];

const SERVICES_PREVIEW = [
  { icon: IdCard, name: "Aadhaar" },
  { icon: BookMarked, name: "Passport" },
  { icon: Car, name: "Driving Licence" },
  { icon: Users, name: "Caste Certificate" },
  { icon: GraduationCap, name: "Scholarships" },
  { icon: HeartPulse, name: "Ayushman" },
];

const TESTIMONIALS = [
  { name: "Ravi K.", role: "Farmer, AP", quote: "I got my income certificate without visiting the office twice. The assistant told me exactly what to upload." },
  { name: "Priya S.", role: "Student, TN", quote: "Applied for scholarship in Tamil. It even reminded me to get the caste certificate first." },
  { name: "Mahesh R.", role: "Senior citizen, KA", quote: "Voice input made it easy. I could speak, and it filled the form for me." },
];

const FAQS = [
  { q: "Is GovAssist AI an official government portal?", a: "No. We're an assistant that guides you to official portals and helps you prepare applications correctly the first time." },
  { q: "Which services are supported?", a: "Aadhaar, PAN, Passport, Driving Licence, Voter ID, Ration Card, and Income / Caste / Residence / Birth / Marriage certificates, plus scholarships and health schemes." },
  { q: "Is my data safe?", a: "Documents are encrypted and you can delete them anytime from your profile." },
  { q: "Is it free?", a: "Yes, the assistant is free. You only pay official government fees on the official portal." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero shadow-elegant">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">GovAssist AI</span>
          </Link>
          <nav className="ml-6 hidden gap-6 md:flex text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#services" className="hover:text-foreground">Services</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LanguagePicker />
            <Link to="/auth" className="hidden sm:block">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="gap-1">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-soft" />
        <div className="absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 left-0 -z-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" /> AI-powered · 15+ services
              </Badge>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                One intelligent assistant for{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">every government service</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                Skip the confusion. Chat with our AI to find the right service, upload documents once,
                and let us auto-fill and track your application end-to-end.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/chat">
                  <Button size="lg" className="gap-2 shadow-elegant">
                    Ask the Assistant <MessageSquare className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline">Browse services</Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-secondary" /> Free to use</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-secondary" /> 5 languages</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-secondary" /> No spam</div>
              </div>
            </div>

            {/* Chat preview card */}
            <div className="relative">
              <Card className="p-4 md:p-6 shadow-elegant border-2">
                <div className="flex items-center gap-2 border-b pb-3">
                  <div className="h-2 w-2 rounded-full bg-destructive/60" />
                  <div className="h-2 w-2 rounded-full bg-accent/60" />
                  <div className="h-2 w-2 rounded-full bg-secondary/60" />
                  <span className="ml-2 text-xs text-muted-foreground">GovAssist AI</span>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-primary-foreground">
                      I need a caste certificate
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                      <div className="font-medium">Here's what you'll need:</div>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        <li>• Aadhaar of applicant</li>
                        <li>• Father's caste certificate</li>
                        <li>• Ration card / residence proof</li>
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <Badge>Processing: 15–30 days</Badge>
                        <Badge variant="secondary">Fee: ₹10–50</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[70%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2 text-muted-foreground">
                      Shall I start your application?
                    </div>
                  </div>
                </div>
              </Card>
              <div className="absolute -bottom-6 -right-6 hidden md:block">
                <Card className="p-3 shadow-elegant">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/20">
                      <ShieldCheck className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium">Aadhaar verified</div>
                      <div className="text-muted-foreground">via OCR</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="max-w-2xl">
          <Badge variant="secondary">Features</Badge>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Everything you need, in one flow</h2>
          <p className="mt-3 text-muted-foreground">Purpose-built for real citizens — from students to senior citizens.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6 shadow-card-soft hover:shadow-elegant transition-shadow">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-muted/40 border-y">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-20">
          <div className="max-w-2xl">
            <Badge variant="secondary">How it works</Badge>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Four simple steps</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {STEPS.map((s) => (
              <Card key={s.n} className="p-6">
                <div className="text-sm font-mono text-primary">{s.n}</div>
                <div className="mt-2 font-semibold">{s.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section id="services" className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="max-w-2xl">
            <Badge variant="secondary">Supported services</Badge>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">15+ services covered</h2>
            <p className="mt-3 text-muted-foreground">Identity, travel, welfare, education, health and civil records.</p>
          </div>
          <Link to="/services"><Button variant="outline">View all</Button></Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {SERVICES_PREVIEW.map((s) => (
            <Card key={s.name} className="p-4 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-medium text-center">{s.name}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 grid gap-10 md:grid-cols-3">
          {[
            { k: "10x", v: "Faster applications" },
            { k: "5", v: "Indian languages supported" },
            { k: "24/7", v: "AI assistant availability" },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-5xl font-semibold">{s.k}</div>
              <div className="mt-1 opacity-90">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="max-w-2xl">
          <Badge variant="secondary">Testimonials</Badge>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Loved by citizens across India</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="p-6">
              <p className="text-sm">"{t.quote}"</p>
              <div className="mt-4 text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 md:px-8 py-20">
        <div className="text-center">
          <Badge variant="secondary">FAQ</Badge>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 pb-20">
        <Card className="p-10 md:p-16 text-center bg-gradient-hero text-primary-foreground border-0 shadow-elegant">
          <h2 className="text-3xl md:text-4xl font-semibold">Start your first application in minutes</h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">
            No paperwork guesswork. Just answer a few questions and we'll handle the rest.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/chat"><Button size="lg" variant="secondary">Open Assistant</Button></Link>
            <Link to="/services"><Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10">See services</Button></Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 grid gap-6 md:grid-cols-4 text-sm">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-hero">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">GovAssist AI</span>
            </div>
            <p className="mt-3 text-muted-foreground">One intelligent assistant for every government service.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Product</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link to="/chat">Assistant</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/tracker">Tracker</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Company</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>About</li><li>Contact</li><li>Careers</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Legal</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>Privacy</li><li>Terms</li><li>Security</li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Made in India · Not affiliated with any government</div>
            <div>© 2026 GovAssist AI</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
