import { retrieveBCContext } from "@/lib/bc-knowledge";

const personaInstructions: Record<string, string> = {
  consultant:
    "Respond as an implementation consultant: pragmatic, process-first, and setup-oriented.",
  developer:
    "Respond as a Business Central developer: include concise AL patterns, events, and extension guidance.",
  controller:
    "Respond as a finance controller: prioritize posting impact, controls, and auditability."
};

export async function generateBCAnswer(userPrompt: string, persona = "consultant") {
  const primaryKey = process.env.GROQ_API_KEY;
  const fallbackKey = process.env.GROQ_API_KEY_FALLBACK;
  const apiKeys = [primaryKey, fallbackKey].filter(Boolean) as string[];
  if (apiKeys.length === 0) {
    throw new Error("Missing GROQ_API_KEY in environment.");
  }
  const context = retrieveBCContext(userPrompt);
  const personaHint = personaInstructions[persona] ?? personaInstructions.consultant;

  const prompt = `
You are AetherBC Nexus, a senior Microsoft Dynamics 365 Business Central assistant.
Use retrieved context first, then your own knowledge.
Respond in clean markdown.
When relevant, include short AL snippets or BC formula-style examples.
${personaHint}

Retrieved context:
${context
  .map((c, i) => `${i + 1}. [${c.doc.topic}] ${c.doc.title}\n${c.doc.content}`)
  .join("\n\n")}

User question:
${userPrompt}
`;

  let response: Response | null = null;
  let lastError = "";
  for (const key of apiKeys) {
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are an expert Dynamics 365 Business Central assistant. Prefer precise, implementation-ready guidance."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (response.ok) break;
    lastError = await response.text();
    response = null;
  }

  if (!response) {
    throw new Error(`Groq API error: ${lastError || "all configured keys failed"}`);
  }

  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text =
    result.choices?.[0]?.message?.content?.trim() ||
    "I could not generate a response right now. Please retry.";

  return {
    text,
    sources: context.map((entry) => ({
      ...entry.doc,
      confidence: Number((Math.min(entry.score / 6, 0.98) * 100).toFixed(0))
    }))
  };
}
