import { NextResponse } from "next/server";
import {
  analyzeTextSafety,
  analyzeImageSafety,
} from "@/lib/services/contentSafetyService";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;

    switch (type) {
      case "text": {
        const body = await req.json();
        if (!body.text) {
          return NextResponse.json(
            { error: 'Field "text" is required' },
            { status: 400 },
          );
        }
        const result = await analyzeTextSafety(body.text);
        return NextResponse.json({ success: true, result });
      }

      case "image": {
        const formData = await req.formData();
        const file = formData.get("image") as File | null;
        if (!file) {
          return NextResponse.json(
            { error: "No image provided" },
            { status: 400 },
          );
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await analyzeImageSafety(buffer);
        return NextResponse.json({ success: true, result });
      }

      default:
        return NextResponse.json(
          { error: "Invalid safety type. Use 'text' or 'image'" },
          { status: 404 },
        );
    }
  } catch (error: any) {
    console.error("Content Safety Error:", error);
    return NextResponse.json(
      { error: error.message || "Content safety check failed" },
      { status: 500 },
    );
  }
}
