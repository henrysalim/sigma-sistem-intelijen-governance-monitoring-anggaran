import { NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/services/documentIntelligence";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 },
      );
    }

    console.log(
      `📄 Analyzing document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
    );

    // Convert Web File to Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await analyzeDocument(buffer);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      analysis: result,
      processingInfo: {
        fileSize: file.size,
        pageCount: result.pageCount,
      },
    });
  } catch (error: any) {
    console.error("Document Analysis Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
