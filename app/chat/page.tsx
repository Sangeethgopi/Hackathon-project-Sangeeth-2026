"use client";

import { useState } from "react";
import { BarChart3, ShieldAlert, Rocket, Menu } from "lucide-react";
import { SidebarTopics } from "@/components/sidebar-topics";
import { ChatPanel } from "@/components/chat-panel";
import { UsageDashboard } from "@/components/usage-dashboard";

export default function ChatWorkspace() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [seededPrompt, setSeededPrompt] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-base">
      {/* Sleek App Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-surface/80 px-6 pt-1 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-elev/50 text-muted transition-colors md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 border border-accent/30 shadow-[0_0_15px_rgba(var(--accent),0.3)]">
              <Rocket className="h-4 w-4 text-accent" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-text">
              AetherBC<span className="text-accent ml-1 font-light">Nexus</span>
            </h1>
          </div>
          <div className="hidden ml-4 pl-4 border-l border-border/50 md:flex items-center gap-2 text-xs text-muted uppercase tracking-[0.1em]">
            <ShieldAlert className="h-3.5 w-3.5 text-accent3 opacity-70" />
            Command Deck
          </div>
        </div>

        <button
          onClick={() => setShowDashboard((prev) => !prev)}
          className={`inline-flex h-9 items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
            showDashboard 
              ? "border-accent2 bg-accent2/20 text-accent2 shadow-[0_0_15px_rgba(var(--accent-2),0.2)]" 
              : "border-border/60 bg-elev/50 text-muted hover:border-accent2/50 hover:text-accent2"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Telemetry <span className="hidden sm:inline">Dashboard</span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`flex-shrink-0 w-[310px] border-r border-border/30 bg-surface/30 p-5 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0"
          }`}
        >
          <SidebarTopics onPromptSelect={setSeededPrompt} />
        </div>

        {/* Play Area */}
        <section className="flex flex-1 flex-col overflow-hidden px-4 md:px-6 py-6 h-full relative">
          
          {showDashboard && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-3 duration-300 shrink-0">
              <UsageDashboard />
            </div>
          )}

          <div className="flex-1 min-h-0 relative">
            <ChatPanel seededPrompt={seededPrompt} />
          </div>
        </section>
      </div>
    </main>
  );
}
