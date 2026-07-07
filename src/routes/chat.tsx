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
import { sendMessage } from "@/services/chat";
import { uploadDocument } from "@/services/upload";

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

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [documentType, setDocumentType] = useState("");

  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  // Chat scroll reference
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send(text?: string) {
    const q = (text ?? input).trim();

    if (!q || sending) return;

    setInput("");
    setSending(true);

    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      text: q,
    };

    const typingMsg: Msg = {
      id: "typing",
      role: "assistant",
      text: "",
      typing: true,
    };

    setMessages((m) => [...m, userMsg, typingMsg]);

    try {
      const result = await sendMessage(
  q,
  ocrText,
  documentType
);

      let serviceId: string | undefined;

      const lowerReply = result.reply.toLowerCase();

      const matchedService = SERVICES.find((service) =>
        lowerReply.includes(service.name.toLowerCase())
      );

      if (matchedService) {
        serviceId = matchedService.id;
      }

      setMessages((m) => [
        ...m.filter((x) => x.id !== "typing"),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: result.reply,
          serviceId,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((m) => [
        ...m.filter((x) => x.id !== "typing"),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Sorry, I couldn't contact the AI server. Please try again.",
        },
      ]);

      toast.error("Unable to connect to AI server");
    } finally {
      setSending(false);
    }
  }

  // DON'T CLOSE ChatPage HERE.
  // Your return (...) should come immediately after this.
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

        {/* Hidden File Input */}
        {/* Hidden File Input */}
<input
  type="file"
  ref={fileInputRef}
  style={{ display: "none" }}
  accept=".jpg,.jpeg,.png,.pdf"
  onChange={async (e) => {

    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    setSelectedFile(file);

    setOcrText("");
    setDocumentType("");

    try {

      const result = await uploadDocument(file);

      console.log(result);

      if (result.success) {

        setOcrText(result.extractedText);
        setDocumentType(result.documentType || "Unknown Document");

        toast.success("Document uploaded successfully");

      } else {

        toast.error("Upload failed");

      }

    } catch (error) {

      console.error(error);

      toast.error("Upload failed");

    }

  }}
/>

        {/* Composer */}
<div className="border-t p-3">

  <div className="flex items-end gap-2 rounded-2xl border bg-background p-2">

    <Button
      variant="ghost"
      size="icon"
      onClick={() => fileInputRef.current?.click()}
    >
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

    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        toast.info("Voice input (Web Speech API placeholder)")
      }
    >
      <Mic className="h-4 w-4" />
    </Button>

    <Button
      size="icon"
      onClick={() => send()}
      disabled={!input.trim() || sending}
    >
      <Send className="h-4 w-4" />
    </Button>

  </div>

  <div className="mt-1.5 text-[11px] text-muted-foreground text-center">
    Answers are AI-generated. Verify important information on the official portal.
  </div>

  {selectedFile && (
  <div className="mt-2 text-xs text-green-600 text-center">
    Uploaded File: {selectedFile.name}
  </div>
)}
{documentType && (
  <div className="mt-2 text-xs text-blue-600 text-center font-medium">
    Detected Document: {documentType}
  </div>
)}

{ocrText && (
  <div className="mt-3 rounded bg-muted p-3">
    <h3 className="font-semibold">
      Extracted Text
    </h3>

    <pre className="text-xs whitespace-pre-wrap">
      {ocrText}
    </pre>
  </div>
)}

</div>

</div>
</AppShell>
);
}

function renderMd(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function ServiceCard({ serviceId }: { serviceId: string }) {
  const s = getService(serviceId);

  if (!s) return null;

  return (
    <Card className="mt-3 p-4 bg-background">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="secondary" className="text-[10px]">
            {s.category}
          </Badge>

          <div className="font-semibold mt-1">
            {s.name}
          </div>

          <div className="text-xs text-muted-foreground">
            {s.description}
          </div>
        </div>

        <a
          href={s.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="text-primary text-xs flex items-center gap-1 hover:underline shrink-0"
        >
          Official
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
        <div>
          <div className="text-muted-foreground">
            Processing
          </div>

          <div className="font-medium">
            {s.processingTime}
          </div>
        </div>

        <div>
          <div className="text-muted-foreground">
            Fee
          </div>

          <div className="font-medium">
            {s.fees}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          Documents
        </div>

        <ul className="mt-1 text-xs space-y-0.5">
          {s.documents.slice(0, 4).map((d) => (
            <li key={d}>• {d}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex gap-2">

        <Link
          to="/services/$id"
          params={{ id: s.id }}
        >
          <Button size="sm" variant="outline">
            View details
          </Button>
        </Link>

        <Link
          to="/apply"
          search={{ service: s.id }}
        >
          <Button size="sm" className="gap-1">
            Start application
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>

      </div>
    </Card>
  );
}