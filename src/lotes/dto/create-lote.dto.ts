import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateLoteDto {
  @ApiProperty({
    example: 1,
    description: 'ID del producto al que pertenece el lote',
  })
  @IsInt()
  id_producto!: number;

  @ApiProperty({
    example: 3.5,
    description: 'Costo unitario del producto en este lote',
  })
  @IsNumber()
  @Min(0)
  costo_unitario!: number;

  @ApiProperty({ example: 70.0, description: 'Precio total del lote' })
  @IsNumber()
  @Min(0)
  precio_lote!: number;

  @ApiProperty({ example: 20, description: 'Cantidad de unidades en el lote' })
  @IsInt()
  @Min(1)
  stock!: number;

  @ApiProperty({
    example: '2025-06-01T00:00:00Z',
    description: 'Fecha de ingreso del lote (ISO 8601)',
  })
  @IsDateString()
  fecha_ingreso!: string;

  @ApiProperty({
    example: '2025-09-01T00:00:00Z',
    description: 'Fecha de vencimiento del lote (ISO 8601)',
  })
  @IsDateString()
  fecha_vencimiento!: string;

  @ApiPropertyOptional({
    example: 'Lote con promoción',
    description: 'Descripción opcional del lote',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 1, description: 'ID del usuario que crea el lote' })
  @IsInt()
  usuario_creacion!: number;
}
