import { NextResponse } from "next/server";
import {
  queryItems,
  saveCitizenReport,
} from "@/lib/services/cosmosService";
import { analyzeTextSafety } from "@/lib/services/contentSafetyService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const regionId = searchParams.get("regionId");

    let reports;
    if (regionId) {
      reports = await queryItems(
        "citizen-reports",
        "SELECT * FROM c WHERE c.regionId = @regionId ORDER BY c.submittedAt DESC",
        [{ name: "@regionId", value: regionId }],
      );
    } else {
      reports = await queryItems(
        "citizen-reports",
        "SELECT * FROM c ORDER BY c.submittedAt DESC",
      );
    }

    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    console.error("Citizen Reports GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch reports" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.description) {
      return NextResponse.json(
        { error: 'Field "description" is required' },
        { status: 400 },
      );
    }

    // Run content safety check on text
    let safetyResult = null;
    try {
      safetyResult = await analyzeTextSafety(body.description);
    } catch (safetyError) {
      console.warn("Content safety check failed, proceeding anyway:", safetyError);
    }

    const report = await saveCitizenReport({
      description: body.description,
      regionId: body.regionId || null,
      location: body.location || null,
      category: body.category || "umum",
      photos: body.photos || [],
      classification: body.classification || null,
      safetyCheck: safetyResult,
    });

    return NextResponse.json({ success: true, data: report, safetyCheck: safetyResult });
  } catch (error: any) {
    console.error("Citizen Reports POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save report" },
      { status: 500 },
    );
  }
}
