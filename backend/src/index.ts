import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

// Import routes
import authRoutes from './routes/auth';
import listingsRoutes from './routes/listings';
import requestsRoutes from './routes/requests';
import matchesRoutes from './routes/matches';
import messagesRoutes from './routes/messages';
import paymentsRoutes from './routes/payments';
import usersRoutes from './routes/users';
import diningHallsRoutes from './routes/diningHalls';

// Import services
import { startMatchingService } from './services/matching';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dining-halls', diningHallsRoutes);

// WebSocket server
const server = createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket connection handling
const clients = new Map<string, any>();

wss.on('connection', (ws, req) => {
  const token = new URL(req.url || '', `http://${req.headers.host}`).searchParams.get('token');
  
  if (!token) {
    ws.close(1008, 'Authentication required');
    return;
  }

  // TODO: Verify JWT token and get userId
  // For now, using token as userId (should be decoded from JWT)
  const userId = token; // This should be decoded from JWT
  
  clients.set(userId, ws);
  console.log(`✅ WebSocket connected: ${userId}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      // Handle incoming messages
      console.log('Received message:', data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(userId);
    console.log(`❌ WebSocket disconnected: ${userId}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast function for WebSocket
export function broadcastToUser(userId: string, data: any) {
  const client = clients.get(userId);
  if (client && client.readyState === 1) {
    client.send(JSON.stringify(data));
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start matching service (runs every 10 seconds)
  startMatchingService(10000);
});

export default app;

