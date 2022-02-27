import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "@services/user.service";
import { User } from "@interfaces/user.interface";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get<string[]>(
      "roles",
      context.getHandler()
    );

    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();

    const user: User = await this.userService.searchUserById(request.userId);

    if (!user) throw new BadRequestException("User not found");

    const hasRole = () => roles.includes(user.role);

    if (!hasRole()) throw new UnauthorizedException("User does not have role");

    return true;
  }
}
