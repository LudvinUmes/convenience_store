import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class IngredienteDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  id_producto_materia_prima!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1, { message: 'La cantidad requerida debe ser al menos 1' })
  cantidad_requerida!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  usuario_creacion!: number;
}

export class UpdateRecetaDto {
  @ApiProperty({
    type: [IngredienteDto],
    example: [
      {
        id_producto_materia_prima: 5,
        cantidad_requerida: 1,
        usuario_creacion: 1,
      },
      {
        id_producto_materia_prima: 8,
        cantidad_requerida: 2,
        usuario_creacion: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredienteDto)
  nueva_receta!: IngredienteDto[];

  @ApiProperty({ example: 1 })
  @IsInt()
  usuario_modificacion!: number;
}
