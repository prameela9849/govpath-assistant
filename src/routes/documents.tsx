import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents — GovAssist AI" }] }),
  component: DocsPage,
});

type Doc = {
  id: string;
  name: string;
  size: number;
  status: "processing" | "verified" | "invalid";
  extracted?: Record<string, string>;
  type: string;
};

const REQUIRED = ["Aadhaar", "PAN Card", "Passport-size Photo", "Residence Proof"];

function DocsPage() {
  const [docs, setDocs] = useState<Doc[]>([
    {
      id: "d1",
      name: "aadhaar-ananya.pdf",
      size: 245_000,
      type: "Aadhaar",
      status: "verified",
      extracted: { Name: "Ananya Sharma", "Aadhaar No.": "XXXX-XXXX-4321", DOB: "12/04/1998", Gender: "Female" },
    },
    {
      id: "d2",
      name: "pan-card.jpg",
      size: 128_000,
      type: "PAN Card",
      status: "verified",
      extracted: { Name: "Ananya Sharma", "PAN No.": "ABCDE1234F", "Father Name": "Rakesh Sharma" },
    },
  ]);
  const [dragOver, setDragOver] = useState(false);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const newDocs: Doc[] = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: guessType(f.name),
      status: "processing" as const,
    }));
    setDocs((d) => [...d, ...newDocs]);
    // TODO: Send to OCR (Tesseract.js) or a server function that calls a doc AI service.
    newDocs.forEach((doc) => {
      setTimeout(() => {
        setDocs((d) =>
          d.map((x) =>
            x.id === doc.id
              ? {
                  ...x,
                  status: "verified",
                  extracted: {
                    Name: "Ananya Sharma",
                    "Detected type": doc.type,
                    Confidence: "97%",
                  },
                }
              : x,
          ),
        );
        toast.success(`${doc.name} verified`);
      }, 1500);
    });
  }

  function remove(id: string) {
    setDocs((d) => d.filter((x) => x.id !== id));
  }

  const uploadedTypes = new Set(docs.filter((d) => d.status === "verified").map((d) => d.type));
  const missing = REQUIRED.filter((r) => !uploadedTypes.has(r));

  return (
    <AppShell>
      <PageHeader
        title="Document Verification"
        description="Upload once — we'll extract, validate and reuse across applications."
        badge="Documents"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Drop zone */}
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            className={`block rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={(e) => addFiles(e.target.files)} />
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary mx-auto">
              <Upload className="h-6 w-6" />
            </div>
            <div className="mt-3 font-semibold">Drop images or PDFs here</div>
            <div className="text-sm text-muted-foreground">or click to browse. We support Aadhaar, PAN, photos and address proofs.</div>
            <div className="text-[11px] text-muted-foreground mt-2">Max 10 MB per file</div>
          </label>

          {/* Uploaded */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Uploaded documents</h3>
              <Badge variant="secondary">{docs.length} files</Badge>
            </div>
            <div className="space-y-3">
              {docs.map((d) => (
                <Card key={d.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-sm truncate">{d.name}</div>
                        <StatusBadge status={d.status} />
                      </div>
                      <div className="text-xs text-muted-foreground">{(d.size / 1024).toFixed(0)} KB · {d.type}</div>
                      {d.extracted && (
                        <div className="mt-3 rounded-lg bg-muted/50 p-3 grid gap-1 sm:grid-cols-2 text-xs">
                          {Object.entries(d.extracted).map(([k, v]) => (
                            <div key={k}><span className="text-muted-foreground">{k}: </span><span className="font-medium">{v}</span></div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => remove(d.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              {docs.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">No documents yet.</div>}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold">Required documents</h3>
            <p className="text-xs text-muted-foreground mt-1">For your active application.</p>
            <ul className="mt-4 space-y-2 text-sm">
              {REQUIRED.map((r) => {
                const done = uploadedTypes.has(r);
                return (
                  <li key={r} className="flex items-center gap-2">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-accent" />
                    )}
                    <span className={done ? "line-through text-muted-foreground" : ""}>{r}</span>
                  </li>
                );
              })}
            </ul>
            {missing.length === 0 ? (
              <Link to="/apply" search={{ service: "caste-certificate" }}>
                <Button className="w-full mt-4 gap-1">Continue application <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            ) : (
              <div className="mt-4 text-xs text-muted-foreground">Upload {missing.length} more to proceed.</div>
            )}
          </Card>
          <Card className="p-5 bg-gradient-hero text-primary-foreground border-0">
            <h3 className="font-semibold">Your data is safe</h3>
            <p className="text-sm opacity-90 mt-1">Encrypted at rest. You can delete any document from your profile anytime.</p>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function guessType(name: string) {
  const n = name.toLowerCase();
  if (n.includes("aadhaar") || n.includes("aadhar")) return "Aadhaar";
  if (n.includes("pan")) return "PAN Card";
  if (n.includes("photo")) return "Passport-size Photo";
  if (n.includes("address") || n.includes("residence") || n.includes("bill")) return "Residence Proof";
  return "Other";
}

function StatusBadge({ status }: { status: Doc["status"] }) {
  if (status === "processing")
    return (
      <Badge variant="outline" className="gap-1 text-[10px]">
        <Loader2 className="h-3 w-3 animate-spin" /> Processing
      </Badge>
    );
  if (status === "verified")
    return (
      <Badge className="gap-1 text-[10px] bg-secondary text-secondary-foreground hover:bg-secondary">
        <CheckCircle2 className="h-3 w-3" /> Verified
      </Badge>
    );
  return (
    <Badge variant="destructive" className="gap-1 text-[10px]">
      <AlertCircle className="h-3 w-3" /> Invalid
    </Badge>
  );
}
