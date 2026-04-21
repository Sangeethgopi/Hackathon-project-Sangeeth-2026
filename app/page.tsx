import Link from "next/link";
import { ArrowRight, Bot, DatabaseZap } from "lucide-react";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6">
      <div className="animate-float rounded-3xl border border-border/70 bg-surface/55 px-8 py-10 text-center shadow-glass backdrop-blur-xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.15em] text-accent">
          <Bot className="h-3.5 w-3.5" />
          Intelligent Business Central Navigator
        </div>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight">
          AetherBC Nexus
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-muted">
          Premium command center for Dynamics 365 Business Central operations, diagnostics, and decision support.
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 rounded-xl border border-accent/50 bg-accent/20 px-5 py-2.5 font-medium text-accent transition hover:bg-accent/30"
        >
          Open Workspace
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 inline-flex items-center gap-2 text-sm text-muted">
        <DatabaseZap className="h-4 w-4 text-accent2" />
        Enterprise-ready deployment and analytics cockpit
      </div>
    </main>
  );
}
