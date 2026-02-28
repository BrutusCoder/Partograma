// =====================================================================
// CreateUnitDto — Validação para criação de unidade hospitalar
// =====================================================================

import { IsString, IsNotEmpty, MaxLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty({ description: 'Nome da unidade de saúde', example: 'Maternidade Central' })
  @IsString()
  @IsNotEmpty({ message: 'Nome da unidade é obrigatório' })
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({
    description: 'Código externo (ex.: CNES)',
    example: '2078015',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  externalId?: string | null;

  @ApiPropertyOptional({ description: 'Unidade ativa?', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
