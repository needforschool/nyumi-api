import { Controller, Get } from "@nestjs/common";

import { User } from "@interfaces/user.interface";
import { UserService } from "@services/user.service";
import { Authorized } from "@decorators/authorized.decorator";
import { Role } from "@enums/role.enum";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Authorized(Role.ADMIN)
  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.searchUser();
  }
}
