import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FirebaseUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const header =
      request.headers['x-endpoint-api-userinfo'] ||
      request.headers['x-apigateway-api-userinfo'];

    console.log(`headers: ${request.headers}`);

    if (!header) return null;

    try {
      const decoded = Buffer.from(header, 'base64').toString('utf8');
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  },
);
