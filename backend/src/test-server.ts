import express from 'express';
import cors from 'cors';
import config from './config/config';
import { logger } from './utils/logger';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = config.server.port;
app.listen(port, () => {
  logger.info(`Test server running on port ${port}`);
  console.log(`✓ Server started on http://localhost:${port}`);
});
