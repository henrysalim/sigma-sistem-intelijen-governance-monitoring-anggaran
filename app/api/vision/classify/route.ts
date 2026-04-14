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

    return NextResponse.json({
      success: true,
      fileName: file.name,
      classification: result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
