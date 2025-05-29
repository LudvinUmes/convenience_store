import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductoDto {
  @ApiProperty({ required: false })
  nombre?: string;

  @ApiProperty({ required: false })
  descripcion?: string;

  @ApiProperty({ required: false })
  precio_referencia?: number;

  @ApiProperty({ required: false })
  id_unidad_medida?: number;

  @ApiProperty({ required: false })
  stock_minimo?: number;

  @ApiProperty({ required: false })
  id_categoria?: number;

  @ApiProperty({ required: false, enum: ['FINAL', 'PREPARADO'] })
  tipo?: 'FINAL' | 'PREPARADO';

  @ApiProperty({ required: false })
  es_materia_prima?: boolean;

  @ApiProperty({ required: false })
  receta?: string;

  @ApiProperty({ required: false })
  usuario_modificacion?: number;

  @ApiProperty({ required: false })
  id_marca?: number;
}
