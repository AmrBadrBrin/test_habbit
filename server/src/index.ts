import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateTelegram } from './middleware/auth';
import habitsRouter from './routes/habits';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Protected API routes
app.use('/api/habits', authenticateTelegram, habitsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
