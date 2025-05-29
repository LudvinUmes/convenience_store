import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecetaDto {
  @ApiProperty({
    type: [Object],
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
  nueva_receta!: {
    id_producto_materia_prima: number;
    cantidad_requerida: number;
    usuario_creacion: number;
  }[];

  @ApiProperty({ example: 1 })
  usuario_modificacion!: number;
}
