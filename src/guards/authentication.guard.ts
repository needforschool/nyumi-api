import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { TokenService } from "@services/token.service";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured: boolean = this.reflector.get<boolean>(
      "secured",
      context.getHandler()
    );

    if (!secured) return true;

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization)
      throw new UnauthorizedException("No authorization header were provided");

    const token = authorization.split(" ")[1];

    const validToken = await this.tokenService.decodeToken(token);

    if (!validToken && !validToken.userId) return false;

    request.userId = validToken.userId;
    return true;
  }
}
