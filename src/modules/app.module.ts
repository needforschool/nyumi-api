import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ConfigService } from "services/config/config.service";
import { UserModule } from "./user.module";

@Module({
  controllers: [],
  exports: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        ".env.local",
        ".env",
        ".env.development.local",
        ".env.development",
        ".env.production",
      ],
      isGlobal: true,
    }),
    UserModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
