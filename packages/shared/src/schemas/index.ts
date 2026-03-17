import { z } from 'zod';

export const ContractIdSchema = z.string().regex(/^C[A-Z0-9]{55}$/);

export const InvocationSchema = z.object({
  id: z.string(),
  contractId: ContractIdSchema,
  functionName: z.string(),
  invoker: z.string(),
  timestamp: z.string().datetime(),
  status: z.enum(['SUCCESS', 'FAILED']),
  error: z.object({
    code: z.number(),
    type: z.string(),
    description: z.string(),
  }).optional(),
  resources: z.object({
    cpuInstructions: z.number(),
    memoryBytes: z.number(),
    ledgerReads: z.number(),
    ledgerWrites: z.number(),
  }),
});

export type Invocation = z.infer<typeof InvocationSchema>;
