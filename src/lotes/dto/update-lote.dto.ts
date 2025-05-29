import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLoteDto {
  @ApiPropertyOptional({ example: 4.0 })
  costo_unitario?: number;

  @ApiPropertyOptional({ example: 80.0 })
  precio_lote?: number;

  @ApiPropertyOptional({ example: 18 })
  stock?: number;

  @ApiPropertyOptional({ example: '2025-06-05T00:00:00Z' })
  fecha_ingreso?: string;

  @ApiPropertyOptional({ example: '2025-10-01T00:00:00Z' })
  fecha_vencimiento?: string;

  @ApiPropertyOptional({
    example: 'Actualización por corrección de inventario',
  })
  descripcion?: string;
}
