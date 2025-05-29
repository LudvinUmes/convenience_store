import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IngredienteDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  id_producto_materia_prima!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  cantidad_requerida!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  usuario_creacion!: number;
}

export class CreateRecetaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id_producto_preparado!: number;

  @ApiProperty({
    type: [IngredienteDto],
    example: [
      {
        id_producto_materia_prima: 5,
        cantidad_requerida: 1,
        usuario_creacion: 1,
      },
      {
        id_producto_materia_prima: 7,
        cantidad_requerida: 2,
        usuario_creacion: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredienteDto)
  ingredientes!: IngredienteDto[];

  @ApiProperty({ example: 1 })
  @IsInt()
  usuario_creacion!: number;
}
