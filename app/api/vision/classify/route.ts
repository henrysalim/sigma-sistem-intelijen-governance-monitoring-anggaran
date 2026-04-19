import { NextResponse } from "next/server";
import { classifyInfrastructureImage } from "@/lib/services/customVisionService";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await classifyInfrastructureImage(buffer);

    // Sanitize classification strings to remove any unexpected HTML-like tags
    const sanitize = (s: any) => {
      if (typeof s !== "string") return s;
      return s.replace(/<[^>]*>/g, "").trim();
    };

    const classification = result || {};
    if (classification.topPrediction && classification.topPrediction.tagName) {
      classification.topPrediction.tagName = sanitize(classification.topPrediction.tagName);
    }
    if (Array.isArray(classification.allPredictions)) {
      classification.allPredictions = classification.allPredictions.map((p: any) => ({
        ...p,
        tagName: sanitize(p.tagName),
      }));
    }
    if (Array.isArray(classification.captions)) {
      classification.captions = classification.captions.map((c: any) => ({
        ...c,
        text: sanitize(c.text),
      }));
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      classification,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
