"use client";

import { useState } from "react";
import { BarChart3, Sparkles } from "lucide-react";
import { SidebarTopics } from "@/components/sidebar-topics";
import { ChatPanel } from "@/components/chat-panel";
import { UsageDashboard } from "@/components/usage-dashboard";

export default function ChatWorkspace() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [seededPrompt, setSeededPrompt] = useState("");

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-8">
      <header className="mb-6 flex flex-col items-center gap-4">
        <div className="w-full max-w-4xl rounded-3xl border border-border/60 bg-white/[0.03] p-5 shadow-glass backdrop-blur-xl transition duration-300 hover:border-accent/40">
          <div className="mb-1 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h1 className="text-center text-xl font-semibold text-text md:text-2xl">
              AetherBC Nexus Command Deck
            </h1>
          </div>
          <p className="text-center text-sm text-muted md:text-base">
            Ask anything about Dynamics 365 Business Central operations, setup, and troubleshooting.
          </p>
        </div>
        <button
          onClick={() => setShowDashboard((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-xl border border-accent2/40 bg-accent2/15 px-4 py-2 text-sm text-accent2 transition hover:bg-accent2/25"
        >
          <BarChart3 className="h-4 w-4" />
          Toggle Telemetry
        </button>
      </header>

      {showDashboard && (
        <div className="mb-5 animate-in fade-in slide-in-from-top-3 duration-300">
          <UsageDashboard />
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[310px_1fr]">
        <SidebarTopics onPromptSelect={setSeededPrompt} />
        <div className="h-[72vh]">
          <ChatPanel seededPrompt={seededPrompt} />
        </div>
      </section>
    </main>
  );
}
