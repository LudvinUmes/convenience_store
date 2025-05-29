import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AssingIngredienteDto {
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
