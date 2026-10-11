import { z } from 'zod';

const platformTokenBaseClaimsSchema = z.object({
  sub: z.uuid(),
  sid: z.uuid(),
  actorType: z.literal('platform_admin'),
  iat: z.number().int(),
  exp: z.number().int(),
});

export const platformAccessTokenClaimsSchema =
  platformTokenBaseClaimsSchema.extend({
    tokenType: z.literal('access'),
  });

export const platformRefreshTokenClaimsSchema =
  platformTokenBaseClaimsSchema.extend({
    tokenType: z.literal('refresh'),
  });

export type PlatformAccessTokenPayload = Omit<
  z.infer<typeof platformAccessTokenClaimsSchema>,
  'iat' | 'exp'
>;

export type PlatformRefreshTokenPayload = Omit<
  z.infer<typeof platformRefreshTokenClaimsSchema>,
  'iat' | 'exp'
>;
