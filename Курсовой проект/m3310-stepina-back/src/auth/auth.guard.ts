import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public-access.decorator';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();

    if (!req.path.startsWith('/api/')) return true;

    const res = context.switchToHttp().getResponse();

    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (!req.cookies) req.cookies = {};
        req.cookies['sAccessToken'] = token;
        req.headers.cookie = `sAccessToken=${token}`;
    } else {
        if (!req.cookies || Object.keys(req.cookies).length === 0) {
        const cookieHeader = req.headers.cookie;
        if (cookieHeader) {
            req.cookies = Object.fromEntries(
            cookieHeader.split(';').map(c => {
                const [key, ...val] = c.trim().split('=');
                return [key.trim(), val.join('=')];
            })
            );
        }
        }
    }

    try {
        const session = await Session.getSession(req, res, {
        sessionRequired: true,
        overrideGlobalClaimValidators: () => [],
        });

        if (!session) throw new UnauthorizedException('Требуется авторизация');

        req.session = session;
        return true;
    } catch {
        throw new UnauthorizedException('Требуется авторизация');
    }
    }
}