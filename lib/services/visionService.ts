import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import nodeFetch from "node-fetch";

/**
 * Upload image buffer to blob, call Azure Computer Vision analyze API,
 * and return classification + blob URL + raw response.
 *
 * Uses native fetch for the Computer Vision call to match Next.js runtime.
 */
export async function classifyInfrastructureImage(buffer: Buffer, originalName?: string) {
  // Validate env
  const connStr = process.env.AZURE_BLOB_CONNECTION_STRING;
  const containerName = process.env.AZURE_BLOB_CONTAINER;
  if (!connStr || !containerName) {
    throw new Error("Missing AZURE_BLOB_CONNECTION_STRING or AZURE_BLOB_CONTAINER");
  }

  // Upload to Blob Storage
  const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const ext = (originalName?.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ext === "jpg" ? "jpeg" : ext;
  const blobName = `${Date.now()}-${uuidv4()}.${ext}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: `image/${safeExt}` },
  });

  // Build blob URL; if account key is provided, generate a 1-hour SAS
  let blobUrlWithSas = blockBlobClient.url;
  const accountName = process.env.AZURE_BLOB_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_BLOB_ACCOUNT_KEY;
  if (accountName && accountKey) {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const sas = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"),
        expiresOn: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
      sharedKeyCredential,
    ).toString();
    blobUrlWithSas = `${blockBlobClient.url}?${sas}`;
  }

  // Call Azure Computer Vision (native fetch)
  const cvEndpoint = process.env.AZURE_CV_ENDPOINT;
  const cvKey = process.env.AZURE_CV_KEY;
  if (!cvEndpoint || !cvKey) {
    throw new Error("Missing AZURE_CV_ENDPOINT or AZURE_CV_KEY");
  }

  const analyzeUrl = `${cvEndpoint.replace(/\/$/, "")}/vision/v3.2/analyze?visualFeatures=Tags,Description,Objects`;

  const res = await nodeFetch(analyzeUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": cvKey,
      "Content-Type": "application/octet-stream",
    },
    body: buffer,
  });

  if (!res.ok) {
    const body = (await res.text().catch(() => "")).trim() || res.statusText;
    const err = new Error(body);
    (err as any).status = res.status;
    throw err;
  }

  const data = await res.json();

  const allPredictions = Array.isArray(data.tags)
    ? data.tags.map((t: any) => ({ tagName: t.name, probability: t.confidence }))
    : [];

  const topPrediction = allPredictions.length
    ? allPredictions.reduce((a: any, b: any) => (a.probability >= b.probability ? a : b))
    : null;

  const captions = data.description?.captions || [];

  return {
    blobUrl: blobUrlWithSas,
    classification: { topPrediction, allPredictions, captions },
    raw: data,
  };
}
