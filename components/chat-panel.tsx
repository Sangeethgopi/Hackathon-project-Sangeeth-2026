"use client";

import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Send, ShieldCheck, Sparkles, Briefcase, Code, Calculator, Check, Copy, Paperclip, X } from "lucide-react";

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

const PERSONAS = [
  { id: "consultant", label: "Consultant", icon: Briefcase, colorClass: "text-accent3", borderClass: "border-accent3/40", bgClass: "bg-accent3/15", activeBorder: "border-accent3", activeBg: "bg-accent3/20" },
  { id: "developer", label: "Developer", icon: Code, colorClass: "text-accent", borderClass: "border-accent/40", bgClass: "bg-accent/15", activeBorder: "border-accent", activeBg: "bg-accent/20" },
  { id: "controller", label: "Controller", icon: Calculator, colorClass: "text-accent2", borderClass: "border-accent2/40", bgClass: "bg-accent2/15", activeBorder: "border-accent2", activeBg: "bg-accent2/20" }
];

const QUICK_ACTIONS: Record<string, string[]> = {
  consultant: [
    "Create a troubleshooting checklist for sales posting setup.",
    "Explain Ship and Invoice posting impact on value entries.",
    "How to set up dimension default priorities?"
  ],
  developer: [
    "Generate AL validation logic for blocked customers.",
    "Show me an API page extension example for items.",
    "How to subscribe to OnAfterPostSalesDoc event?"
  ],
  controller: [
    "How to automate bank account reconciliation?",
    "Explain the setup for multi-currency consolidations.",
    "What causes a G/L entry to be out of balance?"
  ]
};

function CodeBlock({ node, inline, className, children, ...props }: any) {
  const match = /language-(\w+)/.exec(className || "");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative group rounded-xl overflow-hidden my-4 border border-border/70 shadow-sm">
        <div className="flex items-center justify-between bg-elev/90 px-4 py-2.5 text-xs font-mono text-muted backdrop-blur-md border-b border-border/50">
          <span className="uppercase tracking-wider">{match[1]}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 hover:text-text transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
        <pre className="overflow-x-auto bg-base/95 p-4 text-[13px] leading-relaxed relative" {...props}>
          <code className={className}>{children}</code>
        </pre>
      </div>
    );
  }

  return (
    <code className="rounded-md bg-base/80 border border-border/40 px-1.5 py-0.5 text-accent2 font-mono text-[0.9em]" {...props}>
      {children}
    </code>
  );
}

export function ChatPanel({
  seededPrompt
}: {
  seededPrompt?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activePersona, setActivePersona] = useState("consultant");
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [fileContext, setFileContext] = useState<{ name: string; content: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContext({ name: file.name, content });
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    // Initial welcome message based on persona
    setMessages([
      {
        role: "assistant",
        content: `Welcome to **AetherBC Nexus**. Active Context: **${PERSONAS.find(p => p.id === activePersona)?.label}**. How can I assist with your Dynamics 365 Business Central operations today?`
      }
    ]);
  }, [activePersona]);

  useEffect(() => {
    if (seededPrompt) setInput(seededPrompt);
  }, [seededPrompt]);

  async function sendMessage() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    setSources([]); // Clear sources while loading
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: msg, 
          persona: activePersona,
          fileContent: fileContext?.content 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate response.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
      setSources(data.sources ?? []);
      setFileContext(null); // Clear context after sending
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

  const currentPersonaData = PERSONAS.find(p => p.id === activePersona) || PERSONAS[0];

  return (
    <section className="flex h-full flex-col rounded-3xl border border-border/60 bg-surface/60 p-6 backdrop-blur-xl shadow-glass flex-1 max-h-[85vh]">
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2 text-sm text-text font-medium tracking-wide">
          <Sparkles className={`h-4 w-4 ${currentPersonaData.colorClass} animate-pulseFast`} />
          AetherBC Nexus Assistant
        </div>
        
        {/* Persona Selector */}
        <div className="flex items-center gap-2 bg-base/50 p-1 rounded-2xl border border-border/50 backdrop-blur-md">
          {PERSONAS.map((p) => {
            const isActive = activePersona === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                  isActive 
                    ? `${p.activeBg} text-text border ${p.activeBorder} shadow-sm` 
                    : "text-muted hover:text-text border border-transparent hover:bg-elev/50"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? p.colorClass : "opacity-70"}`} />
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-4 flex max-w-full gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {QUICK_ACTIONS[activePersona].map((action) => (
          <button
            key={action}
            onClick={() => setInput(action)}
            className={`shrink-0 rounded-xl border border-border/60 bg-elev/70 px-4 py-2 text-xs text-muted transition duration-300 hover:text-text hover:shadow-sm ${currentPersonaData.bgClass.replace('15', '5')} hover:border-${currentPersonaData.activeBorder.split('-')[1]}/50`}
          >
            {action}
          </button>
        ))}
      </div>

      <div className="mb-4 flex-1 space-y-5 overflow-y-auto pr-2 scrollbar-thin">
        {messages.map((message, idx) => {
          const isUser = message.role === "user";
          return (
            <article
              key={`${message.role}-${idx}`}
              className={`flex flex-col ${isUser ? "items-end" : "items-start animate-fade-in"}`}
            >
              <div 
                className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm max-w-[85%] border ${
                  isUser
                    ? `${currentPersonaData.activeBg} ${currentPersonaData.borderClass} text-text/90`
                    : "border-border/50 bg-elev/60 text-text/80 backdrop-blur-sm"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: CodeBlock as any,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </article>
          );
        })}
        
        {loading && (
          <article className="flex flex-col items-start">
            <div className="rounded-2xl border border-border/50 bg-elev/60 p-4 shadow-sm flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className={`h-2 w-2 rounded-full ${currentPersonaData.bgClass.replace('15', '100')} animate-bounce`} style={{ animationDelay: '0ms' }}></span>
                <span className={`h-2 w-2 rounded-full ${currentPersonaData.bgClass.replace('15', '100')} animate-bounce`} style={{ animationDelay: '150ms' }}></span>
                <span className={`h-2 w-2 rounded-full ${currentPersonaData.bgClass.replace('15', '100')} animate-bounce`} style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-xs text-muted tracking-wide">Processing D365 Context...</span>
            </div>
          </article>
        )}

        {sources.length > 0 && (
          <section className="rounded-2xl border border-border/55 bg-elev/40 p-4 mt-2 animate-fade-in backdrop-blur-md">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted font-medium">
              <ShieldCheck className={`h-4 w-4 ${currentPersonaData.colorClass}`} />
              Evidence / Reference Signals
            </div>
            <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
              {sources.map((source) => (
                <article key={source.id} className="rounded-xl border border-border/50 bg-base/50 p-3 hover:border-accent/30 transition-colors">
                  <p className={`text-xs ${currentPersonaData.colorClass} mb-1 line-clamp-1`}>{source.topic}</p>
                  <p className="text-sm text-text font-medium line-clamp-2">{source.title}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="h-1 flex-1 bg-surface rounded-full overflow-hidden">
                      <div className={`h-full ${currentPersonaData.bgClass.replace('15', '100')}`} style={{ width: `${source.confidence}%` }}></div>
                    </div>
                    <span className="text-[10px] text-muted">{source.confidence}%</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {fileContext && (
        <div className="mb-2 flex items-center gap-2 self-start rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs text-accent">
          <Paperclip className="h-3 w-3" />
          <span className="max-w-[200px] truncate">{fileContext.name}</span>
          <button 
            onClick={() => setFileContext(null)}
            className="ml-1 rounded-full p-0.5 hover:bg-accent/20"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      <div className={`flex items-center gap-3 rounded-2xl border border-border/70 bg-elev/40 p-2 shadow-glass focus-within:border-${currentPersonaData.activeBorder.split('-')[1]}/50 transition-colors duration-300`}>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".txt,.md,.json,.csv,.al,.xml"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-base/50 text-muted transition hover:bg-elev hover:text-text"
          aria-label="Attach File"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <input
          className="w-full bg-transparent px-3 py-2.5 text-sm text-text outline-none placeholder:text-muted"
          placeholder={`Ask the ${currentPersonaData.label} about D365 BC...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void sendMessage();
          }}
        />
        <button
          onClick={() => void sendMessage()}
          disabled={(!input.trim() && !fileContext) || loading}
          className={`flex items-center justify-center h-10 w-10 shrink-0 rounded-xl border ${currentPersonaData.borderClass} ${currentPersonaData.bgClass} ${currentPersonaData.colorClass} transition hover:brightness-125 disabled:opacity-50 disabled:hover:brightness-100`}
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
