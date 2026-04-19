import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import {
  queryItems,
  saveAnomaly,
  getAnomaliesByRegion,
} from "@/lib/services/cosmosService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const regionId = searchParams.get("regionId");

    let anomalies;``
    if (regionId) {
      anomalies = await getAnomaliesByRegion(regionId);
    } else {
      anomalies = await queryItems(
        "anomalies",
        "SELECT * FROM c ORDER BY c.detectedAt DESC",
      );
    }

    return NextResponse.json({ success: true, data: anomalies });
  } catch (error: any) {
    console.error("Anomalies GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch anomalies" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.type || !body.description) {
      return NextResponse.json(
        { error: 'Fields "type" and "description" are required' },
        { status: 400 },
      );
    }

    const result = await saveAnomaly({
      type: body.type,
      description: body.description,
      regionId: body.regionId || null,
      severity: body.severity || "SEDANG",
      module: body.module || "Manual",
      metadata: body.metadata || {},
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Anomalies POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save anomaly" },
      { status: 500 },
    );
  }
}
