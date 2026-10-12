import type { Request } from 'express';
import type { AuthenticatedPlatformAdmin } from './authenticated-platform-admin.type.js';

export type AuthenticatedPlatformRequest = Request & {
  platformAdmin: AuthenticatedPlatformAdmin;
};
