import { ApiProperty } from '@nestjs/swagger';

export class AssingIngredienteDto {
  @ApiProperty({ example: 5 })
  id_producto_materia_prima!: number;

  @ApiProperty({ example: 1 })
  cantidad_requerida!: number;

  @ApiProperty({ example: 1 })
  usuario_creacion!: number;
}
