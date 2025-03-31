import ImmudbClient from 'immudb-node';
import { Client as ESClient } from '@elastic/elasticsearch';
import * as crypto from 'crypto';

/**
 * The structure we expect to find under each "batch-hash:..." key in immuDB.
 * Adjust or remove fields if your actual design differs.
 */
interface BatchHashPayload {
  hash: string; // the SHA-256 of the logs
  startTime?: string; // ISO timestamp for the earliest log
  endTime?: string; // ISO timestamp for the latest log
  timestamp?: string; // fallback if you only store one time
  count?: number; // how many logs were in this batch
}

/**
 * This script:
 *  1) Logs into immuDB
 *  2) Scans for all "batch-hash:*" keys
 *  3) For each key, retrieves the stored SHA-256 hash & time window
 *  4) Fetches logs from Elasticsearch in that time window (with a buffer),
 *     re-sorts them in a consistent way, re-hashes them, and compares
 */
async function verifyDatabaseIntegrity() {
  // -- 1) Connect to immuDB ---------------------------------------------
  const immuClient = new ImmudbClient({
    host: process.env.IMMUDB_HOST || 'localhost',
    port: Number(process.env.IMMUDB_PORT) || 3322,
  });
  await immuClient.login({
    user: process.env.IMMUDB_USER || 'immudb',
    password: process.env.IMMUDB_PASSWORD || 'immudb',
  });
  await immuClient.useDatabase({
    databasename: process.env.IMMUDB_DATABASE || 'defaultdb',
  });

  // -- 2) Connect to Elasticsearch ---------------------------------------
  const esClient = new ESClient({
    node: process.env.ELASTIC_URL || 'http://localhost:9200',
  });
  const esIndex = process.env.ELASTIC_INDEX || 'nestjs-logs';

  // -- 3) Gather immuDB keys with prefix "batch-hash:" -------------------
  console.log('Scanning immuDB for batch-hash keys...');
  const batchKeys = await scanImmuDbKeys(immuClient, 'batch-hash:');
  console.log(`Found ${batchKeys.length} batch-hash entries.`);

  // -- 4) Iterate over each key, fetch the payload, recompute, compare ---
  for (const key of batchKeys) {
    const payload = await getImmuDbJson<BatchHashPayload>(immuClient, key);
    if (!payload) {
      console.warn(`Cannot parse JSON for key="${key}". Skipping.`);
      continue;
    }

    if (!payload.hash) {
      console.warn(`No "hash" field for key="${key}". Skipping.`);
      continue;
    }

    // If we have both start/end times, use them.
    // Otherwise, fallback to (timestamp, timestamp + 1 min).
    const { startTime, endTime, timestamp, count: immuCount } = payload;
    let windowStart: Date;
    let windowEnd: Date;
    if (startTime && endTime) {
      windowStart = new Date(startTime);
      windowEnd = new Date(endTime);
    } else if (timestamp) {
      const t = new Date(timestamp);
      windowStart = t;
      windowEnd = new Date(t.getTime() + 60_000); // 1 min window if needed
    } else {
      console.warn(`No startTime/endTime/timestamp for key="${key}".`);
      continue;
    }

    if (isNaN(windowStart.getTime()) || isNaN(windowEnd.getTime())) {
      console.warn(`Invalid date fields in payload for key="${key}".`);
      continue;
    }

    // Add a small time buffer to accommodate minor clock drift or late logs
    const bufferMs = 10_000;
    const actualStart = new Date(
      windowStart.getTime() - bufferMs,
    ).toISOString();
    const actualEnd = new Date(windowEnd.getTime() + bufferMs).toISOString();

    // 5) Collect all logs from ES in [actualStart, actualEnd]
    const logs = await fetchAllLogsInRange(
      esClient,
      esIndex,
      actualStart,
      actualEnd,
    );

    // Sort logs in the same way your flush code did (by '@timestamp', etc.)
    logs.sort((a, b) => {
      const tA = new Date(a['@timestamp'] || 0).getTime();
      const tB = new Date(b['@timestamp'] || 0).getTime();
      return tA - tB;
    });

    // Convert logs array to string
    const logsString = JSON.stringify(logs);

    // 6) Compute local hash
    const localHash = crypto
      .createHash('sha256')
      .update(logsString)
      .digest('hex');

    // 7) Compare
    if (localHash !== payload.hash) {
      console.error(`TAMPERING DETECTED for key="${key}".
        immuDB hash=${payload.hash}
        localHash=${localHash}`);
    } else {
      // Optionally compare the log count
      if (typeof immuCount === 'number' && immuCount !== logs.length) {
        console.warn(`Hash matched but log count differs for key="${key}".
          immuDB_count=${immuCount}, ES_count=${logs.length}`);
      } else {
        console.log(`OK: key="${key}", hash match, count=${logs.length}`);
      }
    }
  }

  // 8) Cleanup
  await immuClient.logout();
  await immuClient.shutdown();
  console.log('Verification complete.');
}

/**
 * Scan immuDB for all keys starting with a given prefix, returning them as strings.
 */
async function scanImmuDbKeys(
  client: ImmudbClient,
  prefixStr: string,
): Promise<string[]> {
  const prefixBuf = Buffer.from(prefixStr, 'utf8');
  const allKeys: string[] = [];
  let offset: Buffer | undefined;

  while (true) {
    const scanResult = await client.scan({
      prefix: prefixBuf,
      offset,
      limit: 100,
      sortOrder: 0, // ascending
    });

    const items = scanResult.keyvaluesList;
    if (items.length === 0) break;

    for (const kv of items) {
      const keyBuf = kv.getKey_asU8();
      const keyStr = Buffer.from(keyBuf).toString('utf8');
      allKeys.push(keyStr);
    }

    if (items.length < 100) {
      break;
    }
    // Prepare next offset (pagination)
    offset = items[items.length - 1].getKey_asU8_asB64() // or getKey_asU8()
      ? Buffer.from(items[items.length - 1].getKey_asU8())
      : undefined;
  }

  return allKeys;
}

/**
 * Retrieve a key from immuDB and parse JSON.
 */
async function getImmuDbJson<T = any>(
  client: ImmudbClient,
  keyStr: string,
): Promise<T | null> {
  try {
    // For immuDB, we can just pass the string key if the client supports that
    const { value } = await client.get({ key: keyStr });
    // Some versions return value as a Buffer or string. Handle both:
    let raw: string;
    if (typeof value === 'string') {
      raw = value;
    } else if (value instanceof Buffer) {
      raw = value.toString('utf8');
    } else {
      raw = Buffer.from(value as any).toString('utf8');
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to get immuDB key="${keyStr}":`, err);
    return null;
  }
}

/**
 * Fetch all logs from Elasticsearch in a given time window using the scroll API,
 * so we can handle >10k results.
 */
async function fetchAllLogsInRange(
  esClient: ESClient,
  index: string,
  startTime: string,
  endTime: string,
): Promise<any[]> {
  const logs: any[] = [];

  // 1) Initial search with scroll
  let searchResponse = await esClient.search({
    index,
    size: 1000,
    scroll: '1m', // keep the scroll context alive for 1 minute
    sort: [{ '@timestamp': { order: 'asc' } }],
    query: {
      range: {
        '@timestamp': {
          gte: startTime,
          lte: endTime,
        },
      },
    },
  });

  // In ES v8, searchResponse has top-level fields: searchResponse.hits, searchResponse._scroll_id
  let scrollId = searchResponse._scroll_id;
  let hits = searchResponse.hits?.hits || [];
  logs.push(...hits.map((h) => h._source));

  // 2) Keep scrolling while we get hits
  while (hits.length > 0) {
    const scrollResponse = await esClient.scroll({
      scroll: '1m',
      scroll_id: scrollId!,
    });
    scrollId = scrollResponse._scroll_id;
    hits = scrollResponse.hits?.hits || [];
    if (hits.length) {
      logs.push(...hits.map((h) => h._source));
    }
  }

  // 3) Clear scroll
  if (scrollId) {
    try {
      await esClient.clearScroll({ scroll_id: scrollId });
    } catch {
      // ignore
    }
  }

  return logs;
}

// ----------------------------------------------------------------
// Entry point
// ----------------------------------------------------------------
verifyDatabaseIntegrity().catch((err) => {
  console.error('Error in verifyDatabaseIntegrity:', err);
  process.exit(1);
});
