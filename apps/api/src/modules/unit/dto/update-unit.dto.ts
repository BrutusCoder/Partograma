// =====================================================================
// UpdateUnitDto — Validação para atualização de unidade hospitalar
// Todos os campos são opcionais (partial update)
// =====================================================================

import { PartialType } from '@nestjs/swagger';
import { CreateUnitDto } from './create-unit.dto';

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
