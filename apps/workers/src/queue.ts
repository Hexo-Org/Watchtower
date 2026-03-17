import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const eventQueue = new Queue('event-polling-queue', {
  connection: redisConnection,
});

export function createWorker(name: string, processor: any) {
  return new Worker(name, processor, {
    connection: redisConnection,
  });
}
