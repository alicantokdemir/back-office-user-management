import { InternalServerErrorException } from '@nestjs/common';
import { hash } from '@node-rs/argon2';
import { HASHING_OPTIONS } from './constants';

export function isMobile(userAgent: string): boolean {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}

export async function hashSecret(str: string): Promise<string> {
  try {
    return hash(str, HASHING_OPTIONS);
  } catch (err) {
    this.logger.error('Failed to hash', err);

    throw new InternalServerErrorException();
  }
}
