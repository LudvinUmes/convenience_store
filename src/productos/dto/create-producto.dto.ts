import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty()
  nombre!: string;

  @ApiProperty({ required: false })
  descripcion?: string;

  @ApiProperty()
  precio_referencia!: number;

  @ApiProperty()
  id_unidad_medida!: number;

  @ApiProperty()
  stock_minimo!: number;

  @ApiProperty()
  id_categoria!: number;

  @ApiProperty({ enum: ['FINAL', 'PREPARADO'] })
  tipo!: 'FINAL' | 'PREPARADO';

  @ApiProperty()
  es_materia_prima!: boolean;

  @ApiProperty({ required: false })
  receta?: string;

  @ApiProperty()
  usuario_creacion!: number;

  @ApiProperty({ required: false })
  id_marca?: number;
}
