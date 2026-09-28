import { Request, Response } from 'express';
import { StorageService } from '../db/storage.ts';

export const StatsController = {
  async getDashboardStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await StorageService.getStats();
      res.json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch dashboard statistics' });
    }
  },
};
