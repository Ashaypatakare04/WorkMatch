import { PlatformConnector } from '../../models/PlatformConnector.js';

export class ConnectorRegistry {
  private static connectors: Map<string, PlatformConnector> = new Map();

  public static register(connector: PlatformConnector): void {
    ConnectorRegistry.connectors.set(connector.platformId, connector);
  }

  public static get(platformId: string): PlatformConnector | undefined {
    return ConnectorRegistry.connectors.get(platformId);
  }

  public static getAll(): PlatformConnector[] {
    return Array.from(ConnectorRegistry.connectors.values());
  }
}
