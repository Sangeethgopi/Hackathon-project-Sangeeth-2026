# AetherBC Nexus

Premium Next.js assistant for Microsoft Dynamics 365 Business Central documentation using a RAG pattern and Groq.

## Setup

1. Install Node.js with npm available on PATH.
2. Install dependencies:
   - `npm install`
3. Create `.env.local`:
   - `GROQ_API_KEY=...`
   - `GROQ_MODEL=llama-3.3-70b-versatile` (optional override)
4. Start:
   - `npm run dev`

## Included Features

- Glassmorphism search and assistant workspace
- BC topic sidebar (Master Data, Navigation, Sales)
- Markdown AI chat output with code snippet support
- Toggleable Data Engineering dashboard with Recharts
- Vercel deployment config in `vercel.json`
