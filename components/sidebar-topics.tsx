"use client";

import { BookOpenText, Compass, Database, Pin } from "lucide-react";

const topics = [
  {
    name: "Master Data",
    detail: "Item cards, customer posting groups, templates",
    icon: Database
  },
  {
    name: "Navigation",
    detail: "Role centers, tell-me search, dimensions",
    icon: Compass
  },
  {
    name: "Sales",
    detail: "Order lifecycle, pricing, posting routines",
    icon: BookOpenText
  }
];

const playbooks = [
  "Diagnose sales posting error due to missing setup",
  "Validate customer onboarding template for EU trade",
  "Design item pricing strategy with date-effective rules"
];

export function SidebarTopics({
  onPromptSelect
}: {
  onPromptSelect?: (prompt: string) => void;
}) {
  return (
    <aside className="h-full rounded-2xl border border-border/70 bg-surface/60 p-4 backdrop-blur-md">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted">
        Recent Documentation Topics
      </h2>
      <div className="space-y-2">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <div
              key={topic.name}
              className="group rounded-xl border border-border/50 bg-elev/70 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-glass"
            >
              <div className="mb-1 flex items-center gap-2">
                <Icon className="h-4 w-4 text-accent" />
                <h3 className="font-medium text-text">{topic.name}</h3>
              </div>
              <p className="text-sm text-muted">{topic.detail}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted">
          <Pin className="h-4 w-4 text-accent2" />
          Pinned Playbooks
        </h2>
        <div className="space-y-2">
          {playbooks.map((item) => (
            <button
              key={item}
              onClick={() => onPromptSelect?.(item)}
              className="w-full rounded-xl border border-border/50 bg-elev/70 p-3 text-left text-sm text-text transition-all duration-300 hover:border-accent2/50 hover:bg-elev"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
