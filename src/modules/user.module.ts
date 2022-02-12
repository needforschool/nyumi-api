import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthController } from "controllers/auth.controller";
import { TokenSchema } from "interfaces/schemas/token.schema";
import { UserSchema } from "interfaces/schemas/user.schema";
import { JwtConfigService } from "services/config/jwt-config.service";
import { MongoConfigService } from "services/config/mongo-config.service";
import { TokenService } from "services/token.service";
import { UserService } from "services/user.service";

@Module({
  controllers: [AuthController],
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
  providers: [TokenService, UserService],
})
export class UserModule {}
