/**
 * ============================================================================
 * WORKMATCH PLATFORM CONNECTOR REGISTRY
 * ============================================================================
 *
 * ConnectorRegistry implements the Registry / Plugin pattern for multi-platform
 * marketplace integrations (Upwork, Fiverr, Freelancer, and Mock connectors).
 *
 * Responsibilities:
 * - Dynamic Connector Registration: Connectors register their platform ID and
 *   capability flags upon startup.
 * - Platform Lookup: Provides runtime access to connector instances for fetching jobs,
 *   submitting proposals, and validating platform capabilities.
 * - Extensibility: Allows new freelancing platforms (e.g. Toptal, Contra) to be added
 *   modularly without changing downstream scoring or database code.
 */

import { PlatformConnector } from '../../models/PlatformConnector.js';

export class ConnectorRegistry {
  private static connectors: Map<string, PlatformConnector> = new Map();

  /**
   * Registers a platform connector instance into the global registry.
   *
   * @param connector - Instance implementing the PlatformConnector interface.
   */
  public static register(connector: PlatformConnector): void {
    ConnectorRegistry.connectors.set(connector.platformId, connector);
  }

  /**
   * Retrieves a connector by its unique platform identifier (e.g. 'upwork', 'fiverr').
   *
   * @param platformId - The unique platform key.
   * @returns The registered PlatformConnector instance, or undefined if not found.
   */
  public static get(platformId: string): PlatformConnector | undefined {
    return ConnectorRegistry.connectors.get(platformId);
  }

  /**
   * Returns all currently registered platform connector instances.
   */
  public static getAll(): PlatformConnector[] {
    return Array.from(ConnectorRegistry.connectors.values());
  }
}
