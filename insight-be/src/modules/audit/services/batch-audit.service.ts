// src/modules/audit/services/batch-audit.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import ImmudbClient from 'immudb-node';
import * as crypto from 'crypto';

@Injectable()
export class BatchAuditService implements OnModuleInit, OnModuleDestroy {
  private client: ImmudbClient;
  private nonCriticalLogs: Record<string, any>[] = [];

  constructor() {
    this.client = new ImmudbClient({
      host: process.env.IMMUDB_HOST || 'localhost',
      port: Number(process.env.IMMUDB_PORT) || 3322,
    });
  }

  async onModuleInit() {
    await this.client.login({
      user: process.env.IMMUDB_USER || 'immudb',
      password: process.env.IMMUDB_PASSWORD || 'immudb',
    });

    await this.client.useDatabase({
      databasename: process.env.IMMUDB_DATABASE || 'defaultdb',
    });
  }

  /**
   * Called by the unified logging interceptor for non-critical records.
   */
  addLogRecord(record: Record<string, any>) {
    this.nonCriticalLogs.push(record);
  }

  /**
   * By default, flush once every minute (cron: at 0 seconds of every minute).
   * Adjust as needed for your risk vs. performance tradeoff.
   */
  @Cron('0 * * * * *')
  async flushNonCriticalLogs() {
    if (this.nonCriticalLogs.length === 0) {
      return;
    }

    // 1) Convert the entire in-memory array to JSON
    const batchData = JSON.stringify(this.nonCriticalLogs);

    // 2) Compute a single SHA256 hash
    const batchHash = crypto
      .createHash('sha256')
      .update(batchData)
      .digest('hex');

    // 3) We store *only* the hash (plus maybe a timestamp).
    //    That way, if your main logs in Elasticsearch are ever tampered with,
    //    you can re-hash them and compare to the immuDB record.
    const payload = JSON.stringify({
      hash: batchHash,
      // We could store log count or other minimal info if you'd like
      count: this.nonCriticalLogs.length,
      timestamp: new Date().toISOString(),
    });

    // The key can be anything unique
    const key = `batch-hash:${Date.now()}`;

    try {
      await this.client.set({
        key,
        value: payload,
      });
    } catch (err) {
      console.error('Error writing batch hash to immuDB:', err);
    }

    // 4) Clear the in-memory array
    this.nonCriticalLogs = [];
  }

  async onModuleDestroy() {
    // Final flush
    if (this.nonCriticalLogs.length > 0) {
      await this.flushNonCriticalLogs();
    }
    try {
      await this.client.logout();
      await this.client.shutdown();
    } catch (err) {
      // handle error if needed
    }
  }
}
