import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { contractRoutes } from './routes/contracts.js';

const fastify = Fastify({
  logger: true,
});

// Plugins
await fastify.register(cors);
await fastify.register(websocket);

// Routes
await fastify.register(contractRoutes, { prefix: '/api/contracts' });

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', version: '1.0.0' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
