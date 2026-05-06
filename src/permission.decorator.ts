import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export const Permission = (path: string, method: string) =>
  SetMetadata(PERMISSION_KEY, { path, method });