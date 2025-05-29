import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsInt,
  IsDateString,
  IsString,
  Min,
} from 'class-validator';

export class UpdateLoteDto {
  @ApiPropertyOptional({
    example: 4.0,
    description: 'Nuevo costo unitario del lote',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costo_unitario?: number;

  @ApiPropertyOptional({
    example: 80.0,
    description: 'Nuevo precio total del lote',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_lote?: number;

  @ApiPropertyOptional({
    example: 18,
    description: 'Nuevo stock disponible en el lote',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    example: '2025-06-05T00:00:00Z',
    description: 'Nueva fecha de ingreso (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  fecha_ingreso?: string;

  @ApiPropertyOptional({
    example: '2025-10-01T00:00:00Z',
    description: 'Nueva fecha de vencimiento (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;

  @ApiPropertyOptional({
    example: 'Actualización por corrección de inventario',
    description: 'Descripción de la actualización',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
