import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/prompt";
import { AppLanguage, ResponseMode, SchoolLevel } from "@/lib/types";

declare const groq: any;

export const runtime = "nodejs";

const QUOTA_MESSAGE =
  "EduIA est temporairement limité à cause du quota gratuit Gemini. Réessayez plus tard.";

// Analyse un document (image ou PDF de cours) envoyé par l'élève : explication, résumé,
// génération d'exercices ou de quiz à partir du contenu.
export async function POST(req: NextRequest) {
  const gemini = (groq as any).getGeminiClient?.();
  if (!gemini) {
    return NextResponse.json({ error: "GEMINI_API_KEY manquante côté serveur." }, { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const question = (formData.get("question") as string) || "Analyse ce document et explique-le clairement.";
  const level = (formData.get("level") as SchoolLevel) || "6e";
  const language = (formData.get("language") as AppLanguage) || "fr";
  const responseMode = (formData.get("responseMode") as ResponseMode) || "detaillee";

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(level, language, responseMode);
  const model = gemini.getGenerativeModel({ model: (groq as any).GEMINI_MODEL, systemInstruction: systemPrompt });
  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    if (file.type.startsWith("image/")) {
      const result = await model.generateContent([
        { inlineData: { data: bytes.toString("base64"), mimeType: file.type } },
        question
      ]);
      return NextResponse.json({ answer: result.response.text() });
    }

    if (file.type === "application/pdf") {
      // Import pdf-parse dynamically and avoid TypeScript missing declaration error by
      // treating the import as any. Use .default if available.
      const _pdfParseModule = (await import("pdf-parse")) as any;
      const pdfParse = _pdfParseModule.default ?? _pdfParseModule;
      const parsed = await pdfParse(bytes);
      const excerpt = parsed.text.slice(0, 15000);

      const result = await model.generateContent(
        `Voici le contenu extrait d'un PDF de cours envoyé par l'élève :\n\n"""${excerpt}"""\n\nQuestion de l'élève : ${question}`
      );
      return NextResponse.json({ answer: result.response.text() });
    }

    return NextResponse.json({ error: "Type de fichier non supporté." }, { status: 400 });
    } catch (err) {
    console.error("Erreur d'analyse de document:", err);
    const message = (groq as any).isGeminiQuotaError?.(err) ? QUOTA_MESSAGE : "Erreur lors de l'analyse du document.";
    return NextResponse.json({ error: message }, { status: (groq as any).isGeminiQuotaError?.(err) ? 429 : 500 });
  }
}
