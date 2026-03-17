/**
 * Mapping of Soroban HostError codes to human-readable descriptions.
 * Derived from Soroban SDK source (v21.0.0).
 */
export const HOST_ERROR_MAP: Record<number, { type: string; description: string; remediation: string }> = {
  1: {
    type: 'WasmVm',
    description: 'InvalidAction - The WASM VM encountered an invalid operation.',
    remediation: 'Check for out-of-bounds access or invalid instructions in your WASM.',
  },
  2: {
    type: 'Storage',
    description: 'MissingValue - Attempted to access a storage key that does not exist.',
    remediation: 'Verify the storage key exists or check if its TTL has expired.',
  },
  3: {
    type: 'Storage',
    description: 'ExceededLimit - Storage operation exceeded network limits.',
    remediation: 'Reduce the size of storage entries or the number of reads/writes.',
  },
  4: {
    type: 'Auth',
    description: 'InvalidAction - Authorization check failed.',
    remediation: 'Ensure the correct accounts have signed the transaction.',
  },
  5: {
    type: 'Budget',
    description: 'ExceededLimit - Transaction exceeded its CPU or memory budget.',
    remediation: 'Optimize your contract code for lower resource consumption.',
  },
};

export function getHostErrorInfo(code: number) {
  return HOST_ERROR_MAP[code] || {
    type: 'Unknown',
    description: `Unknown HostError code: ${code}`,
    remediation: 'Consult the Soroban SDK source for more details.',
  };
}
