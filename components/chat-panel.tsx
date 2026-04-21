"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Send, ShieldCheck, Sparkles } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type SourceItem = {
  id: string;
  topic: string;
  title: string;
  confidence: number;
};

const quickActions = [
  "Generate AL validation logic for blocked customers on sales order.",
  "Explain Ship and Invoice posting impact on value entries.",
  "Create a troubleshooting checklist for sales posting setup."
];

export function ChatPanel({
  seededPrompt
}: {
  seededPrompt?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Welcome to **AetherBC Nexus**. Ask for posting diagnostics, AL snippets, or setup reviews."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState("consultant");
  const [sources, setSources] = useState<SourceItem[]>([]);

  useEffect(() => {
    if (seededPrompt) setInput(seededPrompt);
  }, [seededPrompt]);

  async function sendMessage() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, persona })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate response.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
      setSources(data.sources ?? []);
    } catch (error) {
      const msgText = error instanceof Error ? error.message : "Unknown error.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Generation failed: ${msgText}\n\nSet \`GROQ_API_KEY\` in your environment and retry.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex h-full flex-col rounded-3xl border border-border/60 bg-surface/60 p-5 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted">
        <Sparkles className="h-4 w-4 text-accent" />
        AetherBC Nexus Assistant
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          className="rounded-xl border border-border/70 bg-base/60 px-3 py-2 text-xs uppercase tracking-[0.12em] text-muted outline-none transition hover:border-accent/40"
        >
          <option value="consultant">Consultant Mode</option>
          <option value="developer">Developer Mode</option>
          <option value="controller">Controller Mode</option>
        </select>
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => setInput(action)}
              className="shrink-0 rounded-xl border border-border/60 bg-elev/70 px-3 py-1.5 text-xs text-muted transition hover:border-accent/50 hover:text-text"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message, idx) => (
          <article
            key={`${message.role}-${idx}`}
            className={`rounded-2xl border p-3.5 text-sm leading-6 shadow-sm ${
              message.role === "user"
                ? "ml-auto max-w-[80%] border-accent/35 bg-accent/10"
                : "max-w-full border-border/50 bg-elev/75"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  return (
                    <code className="rounded bg-base/90 px-1.5 py-0.5 text-accent2" {...props} />
                  );
                },
                pre(props) {
                  return <pre className="overflow-x-auto rounded-lg bg-base/95 p-3" {...props} />;
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </article>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking through BC documentation...
          </div>
        )}
        {sources.length > 0 && (
          <section className="rounded-2xl border border-border/55 bg-elev/70 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted">
              <ShieldCheck className="h-4 w-4 text-accent2" />
              Evidence Signal
            </div>
            <div className="space-y-2">
              {sources.map((source) => (
                <article key={source.id} className="rounded-xl border border-border/55 bg-base/70 p-2.5">
                  <p className="text-xs text-accent">{source.topic}</p>
                  <p className="text-sm text-text">{source.title}</p>
                  <p className="text-xs text-muted">Confidence: {source.confidence}%</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-white/5 p-2.5 shadow-glass">
        <input
          className="w-full bg-transparent px-3 py-2 text-sm text-text outline-none placeholder:text-muted"
          placeholder="Ask about posting, setup, AL logic, or diagnostics..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void sendMessage();
          }}
        />
        <button
          onClick={() => void sendMessage()}
          className="rounded-xl border border-accent/40 bg-accent/20 p-2.5 text-accent transition hover:bg-accent/30"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
