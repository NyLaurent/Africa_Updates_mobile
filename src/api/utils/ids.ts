/**
 * Generates a random ID with the specified entropy size
 * @param entropySize The size of entropy in bytes
 * @returns A random ID string
 */
export function generateIdFromEntropySize(entropySize: number): string {
  const crypto = require('crypto');
  const buffer = crypto.randomBytes(entropySize);
  return buffer.toString('hex');
} 