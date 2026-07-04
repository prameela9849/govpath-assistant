import { createFileRoute, Link } from "@tanstack/react-router";
import { Send, Sparkles, Mic, Paperclip, ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { SERVICES, getService } from "@/lib/services-data";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Assistant — GovAssist AI" }] }),
  component: ChatPage,
});

type Msg =
  | { role: "user"; text: string; id: string }
  | { role: "assistant"; text: string; serviceId?: string; id: string; typing?: boolean };

const SUGGESTIONS = [
  "I need a caste certificate",
  "I want a passport",
  "How can I update Aadhaar?",
  "I need an income certificate",
  "What documents are required for a driving licence?",
];

// TODO: Replace this mock responder with a call to OpenAI / Lovable AI Gateway.
function generateReply(text: string): { reply: string; serviceId?: string } {
  const t = text.toLowerCase();
  const svc =
    SERVICES.find((s) => t.includes(s.name.toLowerCase())) ??
    SERVICES.find((s) => t.includes(s.id.replace("-", " ")));
  if (svc) return { reply: `Here's what I found for **${svc.name}**.`, serviceId: svc.id };
  return {
    reply:
      "I can help with Aadhaar, PAN, Passport, driving licence, voter ID, ration card, and income / caste / residence / marriage certificates, plus scholarships and health schemes. Which one would you like to start?",
  };
}

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm your GovAssist AI. Tell me what service you need — I'll explain eligibility, docs, fees, and next steps.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || sending) return;
    setInput("");
    setSending(true);
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: q };
    const typingMsg: Msg = { id: "typing", role: "assistant", text: "", typing: true };
    setMessages((m) => [...m, userMsg, typingMsg]);

    setTimeout(() => {
      const { reply, serviceId } = generateReply(q);
      setMessages((m) => [
        ...m.filter((x) => x.id !== "typing"),
        { id: crypto.randomUUID(), role: "assistant", text: reply, serviceId },
      ]);
      setSending(false);
    }, 800);
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border bg-card shadow-card-soft overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm">GovAssist AI</div>
            <div className="text-xs text-muted-foreground">Ask anything about government services</div>
          </div>
          <Badge variant="secondary" className="ml-auto">Beta</Badge>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground text-sm">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-hero shrink-0">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm">
                  {m.typing ? (
                    <div className="flex gap-1 items-center h-5">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderMd(m.text) }} />
                      {m.serviceId && <ServiceCard serviceId={m.serviceId} />}
                    </>
                  )}
                </div>
              </div>
            ),
          )}

          {messages.length <= 1 && (
            <div className="pt-4">
              <div className="text-xs text-muted-foreground mb-2">Try asking:</div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border bg-background px-3 py-1.5 text-xs hover:border-primary hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t p-3">
          <div className="flex items-end gap-2 rounded-2xl border bg-background p-2">
            <Button variant="ghost" size="icon" onClick={() => toast.info("Attach documents (mock)")}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about any government service…"
              className="min-h-10 max-h-40 resize-none border-0 focus-visible:ring-0 shadow-none"
              rows={1}
            />
            <Button variant="ghost" size="icon" onClick={() => toast.info("Voice input (Web Speech API placeholder)")}>
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={() => send()} disabled={!input.trim() || sending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-1.5 text-[11px] text-muted-foreground text-center">
            Answers are AI-generated. Verify important information on the official portal.
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function renderMd(text: string) {
  // ultra-minimal bold rendering — TODO: replace with react-markdown for real output.
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function ServiceCard({ serviceId }: { serviceId: string }) {
  const s = getService(serviceId);
  if (!s) return null;
  return (
    <Card className="mt-3 p-4 bg-background">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="secondary" className="text-[10px]">{s.category}</Badge>
          <div className="font-semibold mt-1">{s.name}</div>
          <div className="text-xs text-muted-foreground">{s.description}</div>
        </div>
        <a href={s.officialUrl} target="_blank" rel="noreferrer" className="text-primary text-xs flex items-center gap-1 hover:underline shrink-0">
          Official <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
        <div>
          <div className="text-muted-foreground">Processing</div>
          <div className="font-medium">{s.processingTime}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Fee</div>
          <div className="font-medium">{s.fees}</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Documents</div>
        <ul className="mt-1 text-xs space-y-0.5">
          {s.documents.slice(0, 4).map((d) => (
            <li key={d}>• {d}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to="/services/$id" params={{ id: s.id }}>
          <Button size="sm" variant="outline">View details</Button>
        </Link>
        <Link to="/apply" search={{ service: s.id }}>
          <Button size="sm" className="gap-1">Start application <ArrowRight className="h-3.5 w-3.5" /></Button>
        </Link>
      </div>
    </Card>
  );
}
