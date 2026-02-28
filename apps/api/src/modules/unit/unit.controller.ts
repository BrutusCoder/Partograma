// =====================================================================
// Unit Controller — Endpoints REST para unidades hospitalares
// Base: /api/v1/units
// Acesso: ADMIN para criação/edição; autenticados para leitura.
// =====================================================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserRole } from '@partograma/domain';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('units')
@ApiBearerAuth()
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as unidades hospitalares' })
  @ApiQuery({ name: 'onlyActive', required: false, type: Boolean })
  findAll(@Query('onlyActive') onlyActive?: boolean) {
    return this.unitService.findAll(onlyActive ?? false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma unidade pelo ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria uma nova unidade hospitalar (somente ADMIN)' })
  create(@Body() dto: CreateUnitDto) {
    return this.unitService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza uma unidade hospitalar (somente ADMIN)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUnitDto) {
    return this.unitService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desativa uma unidade hospitalar (somente ADMIN)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitService.remove(id);
  }
}
