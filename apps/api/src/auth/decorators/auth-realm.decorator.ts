import { SetMetadata } from '@nestjs/common';

export const AUTH_REALM_KEY = 'authRealm';

export type AuthRealm = 'public' | 'tenant' | 'platform';

export const SetAuthRealm = (realm: AuthRealm) =>
  SetMetadata(AUTH_REALM_KEY, realm);
