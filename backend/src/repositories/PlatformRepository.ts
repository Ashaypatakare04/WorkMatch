import { Database } from '../database/connection.js';
import { PlatformConnectionState, ConnectorCapabilities, PlatformMode, PlatformStatus } from '../models/PlatformConnector.js';

export class PlatformRepository {
  public static getConnections(userId: string): PlatformConnectionState[] {
    const rows = Database.query<any>('SELECT * FROM platform_connections WHERE user_id = ?', [userId]);

    const defaultPlatforms = [
      {
        platformId: 'upwork',
        name: 'Upwork',
        capabilities: { job_search: true, job_details: true, client_details: true, applications: true, application_status: true }
      },
      {
        platformId: 'fiverr',
        name: 'Fiverr',
        capabilities: { job_search: true, job_details: true, client_details: true, applications: false, application_status: false }
      },
      {
        platformId: 'freelancer',
        name: 'Freelancer',
        capabilities: { job_search: true, job_details: true, client_details: true, applications: true, application_status: false }
      },
      {
        platformId: 'mock',
        name: 'WorkMatch Mock Simulator',
        capabilities: { job_search: true, job_details: true, client_details: true, applications: true, application_status: true }
      }
    ];

    const results: PlatformConnectionState[] = [];
    for (const def of defaultPlatforms) {
      const found = rows.find(r => r.platform_id === def.platformId);
      if (found) {
        results.push({
          platformId: found.platform_id,
          name: def.name,
          status: found.status as PlatformStatus,
          mode: found.mode as PlatformMode,
          capabilities: JSON.parse(found.capabilities),
          lastSync: found.last_sync_at || undefined
        });
      } else {
        // Default uninitialized
        results.push({
          platformId: def.platformId,
          name: def.name,
          status: def.platformId === 'mock' ? 'CONNECTED' : 'DISCONNECTED',
          mode: 'MOCK',
          capabilities: def.capabilities,
          lastSync: def.platformId === 'mock' ? new Date().toISOString() : undefined
        });
      }
    }

    return results;
  }

  public static saveConnection(userId: string, data: {
    platformId: string;
    status: PlatformStatus;
    mode: PlatformMode;
    capabilities: ConnectorCapabilities;
    authDataEncrypted?: string;
  }): void {
    const now = new Date().toISOString();
    Database.execute(
      `INSERT INTO platform_connections (
        id, user_id, platform_id, status, mode, auth_data_encrypted, capabilities, last_sync_at, last_sync_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, platform_id) DO UPDATE SET
        status = excluded.status,
        mode = excluded.mode,
        auth_data_encrypted = COALESCE(excluded.auth_data_encrypted, platform_connections.auth_data_encrypted),
        capabilities = excluded.capabilities,
        updated_at = excluded.updated_at`,
      [
        `conn_${userId}_${data.platformId}`,
        userId,
        data.platformId,
        data.status,
        data.mode,
        data.authDataEncrypted || null,
        JSON.stringify(data.capabilities),
        now,
        'HEALTHY',
        now,
        now
      ]
    );
  }

  public static updateSyncStatus(userId: string, platformId: string, status: string): void {
    const now = new Date().toISOString();
    Database.execute(
      `UPDATE platform_connections
       SET last_sync_at = ?, last_sync_status = ?, updated_at = ?
       WHERE user_id = ? AND platform_id = ?`,
      [now, status, now, userId, platformId]
    );
  }
}
