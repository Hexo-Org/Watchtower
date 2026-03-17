import { FastifyInstance } from 'fastify';
import { InvocationSchema } from '@watchtower/shared';

export async function contractRoutes(fastify: FastifyInstance) {
  // Mock data for initial phase
  const mockContracts = [
    { id: 'CA...123', name: 'LiquidityPool', status: 'Healthy' },
    { id: 'CB...456', name: 'TokenContract', status: 'Warning' },
  ];

  fastify.get('/', async (request, reply) => {
    return mockContracts;
  });

  fastify.get('/:id/invocations', { websocket: true }, (connection, req) => {
    fastify.log.info('WebSocket connection established');
    
    const interval = setInterval(() => {
      const mockInvocation = {
        id: Math.random().toString(36).substring(7),
        contractId: 'CA...123',
        functionName: 'swap',
        invoker: 'G...abc',
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        resources: {
          cpuInstructions: 150000,
          memoryBytes: 2048,
          ledgerReads: 4,
          ledgerWrites: 1,
        },
      };
      
      connection.socket.send(JSON.stringify(mockInvocation));
    }, 5000);

    connection.socket.on('close', () => {
      clearInterval(interval);
      fastify.log.info('WebSocket connection closed');
    });
  });
}
