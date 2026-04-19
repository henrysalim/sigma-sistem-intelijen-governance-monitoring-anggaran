import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = process.env.AZURE_DOC_INTEL_ENDPOINT;
const key = process.env.AZURE_DOC_INTEL_KEY;

interface AnalyzeResultTable {
  rowCount: number;
  columnCount: number;
  cells: Array<{
    rowIndex: number;
    columnIndex: number;
    content: string;
    kind: string;
  }>;
}

interface AnalyzeResult {
  status: string;
  analyzeResult?: {
    content: string;
    tables?: Array<AnalyzeResultTable & { cells: any[] }>;
    paragraphs?: Array<{ role?: string; content: string }>;
    pages?: unknown[];
  };
}

/**
 * Analyze a PDF document (LKPD/APBD) using Azure Document Intelligence.
 * Uses the prebuilt-layout model for table and text extraction.
 *
 * @param {Buffer} fileBuffer - PDF file buffer
 * @returns {Object} Parsed analysis result
 */
export async function analyzeDocument(fileBuffer: Buffer) {
  if (!endpoint || !key) {
    throw new Error(
      "AZURE_DOC_INTEL_ENDPOINT or AZURE_DOC_INTEL_KEY is missing from environment variables.",
    );
  }
  // Dynamic import for ESM-only module
  const { default: DocumentIntelligence } =
    await import("@azure-rest/ai-document-intelligence");

  const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));

  // Convert buffer to base64
  const base64Data = fileBuffer.toString("base64");

  // Start analysis using prebuilt-layout model (best for tables)
  const poller = await client
    .path("/documentModels/{modelId}:analyze", "prebuilt-layout")
    .post({
      contentType: "application/json",
      body: {
        base64Source: base64Data,
      },
      queryParameters: {
        outputContentFormat: "markdown",
      },
    });

  // Poll until completion
  const analyzeUrl = poller.headers["operation-location"] as string;
  let analyzeResult: AnalyzeResult["analyzeResult"] | undefined;
  let status = "running";

  while (status === "running" || status === "notStarted") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const statusResponse = (await client.pathUnchecked(analyzeUrl).get()) as {
      body: AnalyzeResult;
    };
    status = statusResponse.body.status;

    if (status === "succeeded") {
      analyzeResult = statusResponse.body.analyzeResult;
    } else if (status === "failed") {
      throw new Error("Document analysis failed");
    }
  }

  if (!analyzeResult) {
    throw new Error("Analysis completed without a result");
  }

  // Extract tables and key-value pairs
  const tables = (analyzeResult.tables || []).map((table, idx) => ({
    tableIndex: idx,
    rowCount: table.rowCount,
    columnCount: table.columnCount,
    cells: table.cells.map((cell: any) => ({
      rowIndex: cell.rowIndex,
      columnIndex: cell.columnIndex,
      content: cell.content,
      kind: cell.kind, // 'columnHeader', 'rowHeader', 'content'
    })),
  }));

  const paragraphs = (analyzeResult.paragraphs || []).map((p) => ({
    role: p.role,
    content: p.content,
  }));

  return {
    content: analyzeResult.content, // Full markdown content
    tables,
    paragraphs,
    pageCount: analyzeResult.pages?.length || 0,
    tableCount: tables.length,
    paragraphCount: paragraphs.length,
  };
}
