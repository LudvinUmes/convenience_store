import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoteDto {
  @ApiProperty({ example: 1 })
  id_producto!: number;

  @ApiProperty({ example: 3.5 })
  costo_unitario!: number;

  @ApiProperty({ example: 70.0 })
  precio_lote!: number;

  @ApiProperty({ example: 20 })
  stock!: number;

  @ApiProperty({ example: '2025-06-01T00:00:00Z' })
  fecha_ingreso!: string;

  @ApiProperty({ example: '2025-09-01T00:00:00Z' })
  fecha_vencimiento!: string;

  @ApiPropertyOptional({ example: 'Lote con promoción' })
  descripcion?: string;

  @ApiProperty({ example: 1 })
  usuario_creacion!: number;
}
