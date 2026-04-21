"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const data = [
  { day: "Mon", sessions: 1140, queryLatency: 420 },
  { day: "Tue", sessions: 1340, queryLatency: 390 },
  { day: "Wed", sessions: 1520, queryLatency: 360 },
  { day: "Thu", sessions: 1480, queryLatency: 352 },
  { day: "Fri", sessions: 1675, queryLatency: 338 },
  { day: "Sat", sessions: 1220, queryLatency: 360 },
  { day: "Sun", sessions: 1085, queryLatency: 375 }
];

export function UsageDashboard() {
  return (
    <section className="rounded-2xl border border-border/70 bg-surface/70 p-4 backdrop-blur-md">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted">Nexus Telemetry Grid</h3>
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-elev/80 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Weekly Sessions</p>
          <p className="mt-1 text-2xl font-semibold text-text">9,460</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-elev/80 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Median Latency</p>
          <p className="mt-1 text-2xl font-semibold text-accent2">362 ms</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-elev/80 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Quality Score</p>
          <p className="mt-1 text-2xl font-semibold text-accent">96.2%</p>
        </div>
      </div>
      <div className="grid h-72 grid-cols-1 gap-4 lg:grid-cols-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="sessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(190 85% 58%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(190 85% 58%)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="latency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(268 75% 65%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(268 75% 65%)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(220, 30%, 70%, 0.18)" />
            <XAxis dataKey="day" stroke="hsl(220 22% 72%)" />
            <YAxis stroke="hsl(220 22% 72%)" />
            <Tooltip
              contentStyle={{
                background: "hsl(224 28% 10%)",
                border: "1px solid hsl(220 26% 24%)",
                borderRadius: "12px"
              }}
            />
            <Area type="monotone" dataKey="sessions" stroke="hsl(190 85% 58%)" fillOpacity={1} fill="url(#sessions)" />
            <Area type="monotone" dataKey="queryLatency" stroke="hsl(268 75% 65%)" fillOpacity={1} fill="url(#latency)" />
          </AreaChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(220, 30%, 70%, 0.18)" />
            <XAxis dataKey="day" stroke="hsl(220 22% 72%)" />
            <YAxis stroke="hsl(220 22% 72%)" />
            <Tooltip
              contentStyle={{
                background: "hsl(224 28% 10%)",
                border: "1px solid hsl(220 26% 24%)",
                borderRadius: "12px"
              }}
            />
            <Bar dataKey="sessions" fill="hsl(190 85% 58%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
