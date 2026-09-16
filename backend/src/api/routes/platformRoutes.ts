import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { PlatformRepository } from '../../repositories/PlatformRepository.js';
import { ConnectorRegistry } from '../../connectors/base/ConnectorRegistry.js';

export const platformRouter = Router();

// List platforms with live/mock status and capability matrix
platformRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const platforms = PlatformRepository.getConnections(userId);
    res.json({ success: true, platforms });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Connect platform
platformRouter.post('/:id/connect', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'user_default';
    const platformId = req.params.id;
    const connector = ConnectorRegistry.get(platformId);

    if (!connector) {
      res.status(404).json({ error: `Platform connector ${platformId} not found` });
      return;
    }

    await connector.authenticate(req.body);
    const state = await connector.getState();

    PlatformRepository.saveConnection(userId, {
      platformId,
      status: state.status,
      mode: state.mode,
      capabilities: state.capabilities
    });

    res.json({ success: true, message: `${state.name} connected successfully`, state });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Disconnect platform
platformRouter.post('/:id/disconnect', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'user_default';
    const platformId = req.params.id;
    const connector = ConnectorRegistry.get(platformId);

    if (connector) {
      await connector.disconnect();
    }

    PlatformRepository.saveConnection(userId, {
      platformId,
      status: 'DISCONNECTED',
      mode: 'UNAVAILABLE',
      capabilities: connector ? connector.getCapabilities() : {
        job_search: false, job_details: false, client_details: false, applications: false, application_status: false
      }
    });

    res.json({ success: true, message: `Platform ${platformId} disconnected` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
