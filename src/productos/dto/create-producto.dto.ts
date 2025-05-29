import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({ example: 'Pan para Hot Dog' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ required: false, example: 'Pan blanco suave' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 2.5 })
  @IsNumber()
  precio_referencia!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  id_unidad_medida!: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  stock_minimo!: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  id_categoria!: number;

  @ApiProperty({ enum: ['FINAL', 'PREPARADO'], example: 'FINAL' })
  @IsEnum(['FINAL', 'PREPARADO'])
  tipo!: 'FINAL' | 'PREPARADO';

  @ApiProperty({ example: true })
  @IsBoolean()
  es_materia_prima!: boolean;

  @ApiProperty({
    required: false,
    example: '1 pan, 1 salchicha, 1 sobre de mayonesa',
  })
  @IsOptional()
  @IsString()
  receta?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  usuario_creacion!: number;

  @ApiProperty({ required: false, example: 2 })
  @IsOptional()
  @IsInt()
  id_marca?: number;
}
