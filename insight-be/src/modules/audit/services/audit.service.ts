// src/modules/audit/services/audit.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import ImmudbClient from 'immudb-node';
import * as crypto from 'crypto';

@Injectable()
export class AuditService implements OnModuleInit, OnModuleDestroy {
  private client: ImmudbClient;

  constructor() {
    this.client = new ImmudbClient({
      host: process.env.IMMUDB_HOST || 'localhost',
      port: Number(process.env.IMMUDB_PORT) || 3322,
      // If using TLS, include certs here
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
   * Immediately store data in immuDB for critical actions.
   */
  async appendCriticalAuditLog(record: Record<string, any>) {
    // Create JSON string
    const dataString = JSON.stringify(record);

    // Hash the JSON
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');

    // Combine the original data & hash in one object
    const combinedPayload = JSON.stringify({
      data: record,
      hash,
    });

    // Example key format
    const key = `critical-log:${Date.now()}:${Math.random()}`;

    // Write to immuDB
    return this.client.set({
      key,
      value: combinedPayload,
    });
  }

  async onModuleDestroy() {
    try {
      await this.client.logout();
      await this.client.shutdown();
    } catch (err) {
      // handle error silently or log it
    }
  }
}
