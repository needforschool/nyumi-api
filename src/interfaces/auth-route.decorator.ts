import { applyDecorators, SetMetadata } from "@nestjs/common";
import { Role } from "./role.enum";

export const AuthRoute = (...roles: Role[]) =>
  applyDecorators(SetMetadata("secured", true), SetMetadata("roles", roles));
