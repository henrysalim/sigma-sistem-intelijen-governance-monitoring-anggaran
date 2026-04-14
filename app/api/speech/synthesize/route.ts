import { NextResponse } from "next/server";
import { textToSpeech } from "@/lib/services/speechService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, language = "id-ID" } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Field "text" is required' },
        { status: 400 },
      );
    }

    const audioBuffer = await textToSpeech(text, language);

    // Return the buffer directly with correct headers
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
