import { ApiProperty } from '@nestjs/swagger';

export class CreateRecetaDto {
  @ApiProperty({ example: 1 })
  id_producto_preparado!: number;

  @ApiProperty({
    type: [Object],
    example: [
      {
        id_producto_materia_prima: 5,
        cantidad_requerida: 1,
        usuario_creacion: 1,
        fecha_creacion: new Date(),
      },
      {
        id_producto_materia_prima: 7,
        cantidad_requerida: 2,
        usuario_creacion: 1,
        fecha_creacion: new Date(),
      },
    ],
  })
  ingredientes!: {
    id_producto_materia_prima: number;
    cantidad_requerida: number;
    usuario_creacion: number;
  }[];

  @ApiProperty({ example: 1 })
  usuario_creacion!: number;
}
