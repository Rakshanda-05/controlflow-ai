import { Router, Request, Response } from 'express';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';

export const exportRouter = Router();

exportRouter.get('/zip', (req: Request, res: Response) => {
  try {
    const projectRoot = path.resolve(__dirname, '../../../');
    const zipFileName = 'controlflow-ai-complete-source.zip';

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);

    // Append directories while excluding heavy/build folders
    archive.glob('**/*', {
      cwd: projectRoot,
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/.DS_Store',
        '**/*.log',
        '**/controlflow-ai-complete-source.zip',
        '**/controlflow-ai.zip',
      ],
      dot: true,
    });

    archive.finalize();
  } catch (error) {
    console.error('Error generating project ZIP:', error);
    res.status(500).json({ error: 'Failed to generate project archive' });
  }
});
