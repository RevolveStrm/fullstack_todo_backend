import { createHash } from 'node:crypto';

export const generateFilenameHash = (userId: string, originalFilename: string) => {
  const compound: string = `${Date.now()}-${originalFilename}-${userId}`;
  return createHash('sha256').update(compound).digest('hex');
};
