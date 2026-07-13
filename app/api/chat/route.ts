import { NextRequest } from "next/server";
import { client, GROQ_MODEL } from "@/lib/groq";
import { buildSystemPrompt } from "@/lib/prompt";
import { AppLanguage, ResponseMode, SchoolLevel } from "@/lib/types";

export const runtime = "nodejs";

interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  level: SchoolLevel;
  language: AppLanguage;
  responseMode: ResponseMode;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatRequestBody;
  const { messages, level, language, responseMode } = body;

  const systemPrompt = buildSystemPrompt(level, language, responseMode);

  try {
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      stream: true,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      "Une erreur est survenue lors de la génération de la réponse.",
      { status: 500 }
    );
  }
}