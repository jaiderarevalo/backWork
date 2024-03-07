import { applyDecorators } from '@nestjs/common';
import { Role } from 'src/interfaces/role.enum';
import { Roles } from './roles.decorator';

export function Auth(...role: Role[]) {
  return applyDecorators(Roles(...role));
}
