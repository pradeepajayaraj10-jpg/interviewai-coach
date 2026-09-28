import path from 'path';
import express from 'express';
import { app } from './app.ts';

const PORT = Number(process.env.PORT) || 3000;
const DIST_PATH = path.resolve(process.cwd(), 'dist');

// Serve static frontend assets if built
app.use(express.static(DIST_PATH));

// SPA catch-all route for frontend client navigation
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(DIST_PATH, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[InterviewAI Server] Running on http://0.0.0.0:${PORT}`);
});
