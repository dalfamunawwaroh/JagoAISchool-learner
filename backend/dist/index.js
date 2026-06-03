import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
// Import Routes
import authRouter from './routes/auth.js';
import coursesRouter from './routes/courses.js';
import discussionsRouter from './routes/discussions.js';
import consultationsRouter from './routes/consultations.js';
import eventsRouter from './routes/events.js';
import aitoolkitRouter from './routes/aitoolkit.js';
import articlesRouter from './routes/articles.js';
import notificationsRouter from './routes/notifications.js';
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Request logger for standard API tracking
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/discussions', discussionsRouter);
app.use('/api/consultations', consultationsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/aitools', aitoolkitRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/notifications', notificationsRouter);
// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'HEALTHY', timestamp: new Date() });
});
// Start Server
app.listen(PORT, () => {
    console.log(`🚀 JagoAI School Backend Server running successfully on http://localhost:${PORT}`);
});
