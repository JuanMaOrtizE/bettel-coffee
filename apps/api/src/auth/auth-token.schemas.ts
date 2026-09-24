import { z } from 'zod';

export const accessTokenClaimsSchema = z.object({
  sub: z.uuid(),
  tokenType: z.literal('access'),
  iat: z.number().int(),
  exp: z.number().int(),
});

export const refreshTokenClaimsSchema = z.object({
  sub: z.uuid(),
  sid: z.uuid(),
  tokenType: z.literal('refresh'),
  iat: z.number().int(),
  exp: z.number().int(),
});

export type AccessTokenPayload = Omit<
  z.infer<typeof accessTokenClaimsSchema>,
  'iat' | 'exp'
>;

export type RefreshTokenPayload = Omit<
  z.infer<typeof refreshTokenClaimsSchema>,
  'iat' | 'exp'
>;
