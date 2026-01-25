import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

console.log('[1] Imports done');

dotenv.config();

console.log('[2] Dotenv configured');

const app = express();
const PORT = process.env.PORT || 8000;

// Basic middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

console.log('[3] Middleware configured');

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log('[4] Health route added');

// Try importing routes one by one
console.log('[5] Importing auth routes...');
import authRoutes from './api/auth/auth.routes';
console.log('[6] Auth routes imported');

app.use('/api/auth', authRoutes);
console.log('[7] Auth routes mounted');

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
