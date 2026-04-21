import { NextResponse } from "next/server";
import { generateBCAnswer } from "@/lib/gemini";

type ChatRequestBody = {
  message?: string;
  persona?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const message = body.message?.trim();
    const persona = body.persona?.trim() || "consultant";

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const response = await generateBCAnswer(message, persona);
    return NextResponse.json(response);
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unexpected server failure.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
