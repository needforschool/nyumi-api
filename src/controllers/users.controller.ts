import { Controller, Get } from "@nestjs/common";
import { AuthRoute } from "@interfaces/auth-route.decorator";
import { Role } from "@interfaces/role.enum";
import { User } from "@interfaces/user.interface";
import { UserService } from "@services/user.service";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @AuthRoute(Role.Admin)
  @Get()
  async getUsers(): Promise<User[]> {
    return [];
  }
}
