import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateUserDto } from "@dto/create-user.dto";
import { ApiResponse } from "@interfaces/responses/api.response";
import { Token } from "@interfaces/token.interface";
import { User } from "@interfaces/user.interface";
import { TokenService } from "@services/token.service";
import { UserService } from "@services/user.service";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  @Post("register")
  async register(
    @Body() payload: CreateUserDto
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    const usersWithEmail = await this.userService.searchUser({
      email: payload.email,
    });
    if (usersWithEmail && usersWithEmail.length > 0) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: "User with this email already exists",
        data: null,
      };
    }

    const user: User = await this.userService.createUser(payload);
    const { token }: Token = await this.tokenService.createToken(user._id);

    return {
      status: HttpStatus.OK,
      message: "User created successfully",
      data: {
        user,
        token,
      },
    };
  }

  @Post("login")
  async login(
    @Body() payload: CreateUserDto
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    const users: User[] = await this.userService.searchUser({
      email: payload.email,
    });
    if (!users || users.length === 0) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: "User with this email doesn't exists",
        data: null,
      };
    }
    const user: User = users[0];

    if (!(await this.userService.compareUserPassword(user, payload.password))) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: "Wrong password",
        data: null,
      };
    }

    const { token }: Token = await this.tokenService.createToken(user._id);

    return {
      status: HttpStatus.OK,
      message: "User logged in successfully",
      data: {
        user,
        token,
      },
    };
  }
}
