import { NextResponse } from "next/server";
import {
  extractKeyPhrases,
  recognizeEntities,
  analyzeSentiment,
} from "@/lib/services/languageService";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;
    const body = await req.json();
    const { texts } = body;

    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json(
        { error: 'Body must contain "texts" array' },
        { status: 400 },
      );
    }

    let result;
    switch (type) {
      case "entities":
        result = await recognizeEntities(texts);
        break;
      case "keyphrases":
        result = await extractKeyPhrases(texts);
        break;
      case "sentiment":
        result = await analyzeSentiment(texts);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid language operation" },
          { status: 404 },
        );
    }

    return NextResponse.json({ success: true, results: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
