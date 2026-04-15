import { CosmosClient, SqlQuerySpec } from "@azure/cosmos";

const endpoint = process.env.AZURE_COSMOS_ENDPOINT!;
const key = process.env.AZURE_COSMOS_KEY!;
const databaseId = process.env.AZURE_COSMOS_DATABASE!;

const client = new CosmosClient({ endpoint, key });

/**
 * initialize Cosmos DB for dev
 */
export async function initCosmos() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  await database.containers.createIfNotExists({ id: "anomalies" });
  await database.containers.createIfNotExists({ id: "citizen-reports" });
}

/**
 * Get or create a container reference.
 */
function getContainer(containerId: string) {
  return client.database(databaseId).container(containerId);
}

/**
 * Create or upsert an item into a container.
 */
export async function upsertItem(
  containerId: string,
  item: Record<string, unknown>,
) {
  const container = getContainer(containerId);
  const { resource } = await container.items.upsert(item);
  return resource;
}

/**
 * Query items from a container.
 */
export async function queryItems(
  containerId: string,
  query: string,
  parameters: SqlQuerySpec["parameters"] = [],
) {
  const container = getContainer(containerId);
  const { resources } = await container.items
    .query({ query, parameters })
    .fetchAll();
  return resources;
}

/**
 * Get a single item by ID.
 */
export async function getItem(
  containerId: string,
  itemId: string,
  partitionKey: string,
) {
  const container = getContainer(containerId);
  const { resource } = await container.item(itemId, partitionKey).read();
  return resource;
}

/**
 * Delete an item.
 */
export async function deleteItem(
  containerId: string,
  itemId: string,
  partitionKey: string,
) {
  const container = getContainer(containerId);
  await container.item(itemId, partitionKey).delete();
  return { deleted: true };
}

/**
 * Save anomaly detection result.
 */
export async function saveAnomaly(anomalyData: Record<string, unknown>) {
  return upsertItem("anomalies", {
    id: `anomaly-${Date.now()}`,
    ...anomalyData,
    detectedAt: new Date().toISOString(),
  });
}

/**
 * Save citizen report.
 */
export async function saveCitizenReport(reportData: Record<string, unknown>) {
  return upsertItem("citizen-reports", {
    id: `citizen-${Date.now()}`,
    ...reportData,
    submittedAt: new Date().toISOString(),
    status: "pending_review",
  });
}

/**
 * Get anomalies for a region.
 */
export async function getAnomaliesByRegion(regionId: string) {
  return queryItems(
    "anomalies",
    "SELECT * FROM c WHERE c.regionId = @regionId ORDER BY c.detectedAt DESC",
    [{ name: "@regionId", value: regionId }],
  );
}
