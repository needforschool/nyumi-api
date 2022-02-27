import { applyDecorators, SetMetadata } from "@nestjs/common";

import { Role } from "@enums/role.enum";

export const Authorized = (...roles: Role[]) =>
  applyDecorators(SetMetadata("secured", true), SetMetadata("roles", roles));
