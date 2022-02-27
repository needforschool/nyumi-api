import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthController } from "@controllers/auth.controller";
import { TokenSchema } from "@schemas/token.schema";
import { UserSchema } from "@schemas/user.schema";
import { JwtConfigService } from "@services/config/jwt-config.service";
import { MongoConfigService } from "@services/config/mongo-config.service";
import { TokenService } from "@services/token.service";
import { UserService } from "@services/user.service";
import { UsersController } from "@controllers/users.controller";
import { APP_GUARD } from "@nestjs/core";
import { AuthenticationGuard } from "@guards/authentication.guard";
import { PermissionGuard } from "@guards/permission.guard";

@Module({
  controllers: [AuthController, UsersController],
  exports: [],
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
      connectionName: "user-tokens",
    }),
    MongooseModule.forFeature(
      [
        {
          name: "Token",
          schema: TokenSchema,
          collection: "tokens",
        },
      ],
      "user-tokens"
    ),

    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
      connectionName: "users",
    }),
    MongooseModule.forFeature(
      [
        {
          name: "User",
          schema: UserSchema,
          collection: "users",
        },
      ],
      "users"
    ),
  ],
  providers: [
    TokenService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class UserModule {}
