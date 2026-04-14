import { AzureKeyCredential } from "@azure/core-auth";
import DocumentIntelligence from "@azure-rest/ai-document-intelligence";

const endpoint = process.env.AZURE_DOC_INTEL_ENDPOINT!;
const key = process.env.AZURE_DOC_INTEL_KEY!;

export async function analyzeDocument(fileBuffer: Buffer) {
  const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));
  const base64Data = fileBuffer.toString("base64");

  const poller = await client
    .path("/documentModels/{modelId}:analyze", "prebuilt-layout")
    .post({
      contentType: "application/json",
      body: { base64Source: base64Data },
      queryParameters: { outputContentFormat: "markdown" },
    });

  const analyzeUrl = poller.headers["operation-location"];
  let result;
  let status = "running";

  while (status === "running" || status === "notStarted") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const statusResponse = await client.pathUnchecked(analyzeUrl).get();
    status = statusResponse.body.status;

    if (status === "succeeded") {
      result = statusResponse.body.analyzeResult;
    } else if (status === "failed") {
      throw new Error("Document analysis failed");
    }
  }

  // Same mapping logic as your original Express code...
  const tables = (result.tables || []).map((table: any, idx: number) => ({
    /*...*/
  }));
  const paragraphs = (result.paragraphs || []).map((p: any) => ({
    /*...*/
  }));

  return {
    content: result.content,
    tables,
    paragraphs,
    pageCount: result.pages?.length || 0,
    tableCount: tables.length,
    paragraphCount: paragraphs.length,
  };
}
