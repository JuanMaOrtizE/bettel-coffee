import {
  createParamDecorator,
  type ExecutionContext,
} from '@nestjs/common';
import type { AuthenticatedPlatformRequest } from '../authenticated-platform-request.type.js';

export const CurrentPlatformAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request =
      context.switchToHttp().getRequest<AuthenticatedPlatformRequest>();

    return request.platformAdmin;
  },
);
