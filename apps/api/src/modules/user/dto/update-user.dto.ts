// =====================================================================
// UpdateUserDto — Validação para atualização de usuário
// Todos os campos são opcionais (partial update)
// =====================================================================

import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
