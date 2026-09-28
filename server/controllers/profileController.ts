import { Request, Response } from 'express';
import { StorageService } from '../db/storage.ts';

export const ProfileController = {
  async getProfile(_req: Request, res: Response): Promise<void> {
    try {
      const profile = await StorageService.getProfile();
      res.json({ success: true, data: profile });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch profile' });
    }
  },

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { name, college, department, skills, targetRole, experienceLevel, bio } = req.body;
      if (!name || !college || !targetRole) {
        res.status(400).json({ success: false, message: 'Name, college, and targetRole are required fields.' });
        return;
      }

      const updated = await StorageService.updateProfile({
        name,
        college,
        department: department || '',
        skills: Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map((s) => s.trim()) : []),
        targetRole,
        experienceLevel: experienceLevel || 'Fresher',
        bio: bio || '',
      });

      res.json({ success: true, data: updated, message: 'Profile updated successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to update profile' });
    }
  },
};
