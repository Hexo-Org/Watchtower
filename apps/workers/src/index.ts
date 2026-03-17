import { createWorker } from './queue.js';
import { processEventPolling } from './jobs/eventPoller.js';

console.log('Watchtower Workers starting...');

const eventWorker = createWorker('event-polling-queue', processEventPolling);

eventWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

eventWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});
