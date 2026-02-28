// =====================================================================
// CreateUserDto — Validação para criação de usuário
// =====================================================================

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@partograma/domain';

export class CreateUserDto {
  @ApiProperty({ description: 'Username (mesmo do Keycloak)', example: 'maria.silva' })
  @IsString()
  @IsNotEmpty({ message: 'Username é obrigatório' })
  @MaxLength(150)
  username!: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'maria.silva@hospital.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @MaxLength(255)
  email!: string;

  @ApiProperty({ description: 'Primeiro nome', example: 'Maria' })
  @IsString()
  @IsNotEmpty({ message: 'Primeiro nome é obrigatório' })
  @MaxLength(150)
  firstName!: string;

  @ApiProperty({ description: 'Sobrenome', example: 'Silva' })
  @IsString()
  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  @MaxLength(150)
  lastName!: string;

  @ApiProperty({
    description: 'Role RBAC do usuário',
    enum: UserRole,
    example: UserRole.ENFERMEIRO_OBSTETRA,
  })
  @IsEnum(UserRole, { message: 'Role inválida' })
  role!: UserRole;

  @ApiPropertyOptional({
    description: 'ID da unidade hospitalar (multi-tenant)',
    example: 'uuid-da-unidade',
  })
  @IsOptional()
  @IsUUID('4', { message: 'unitId deve ser um UUID v4 válido' })
  unitId?: string | null;

  @ApiPropertyOptional({ description: 'Usuário ativo?', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Sub do Keycloak para vinculação OIDC',
    example: 'keycloak-sub-uuid',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  keycloakSub?: string | null;
}
