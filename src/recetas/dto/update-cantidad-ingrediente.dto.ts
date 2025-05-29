import { ApiProperty } from '@nestjs/swagger';

export class UpdateCantidadDto {
  @ApiProperty({ example: 2 })
  cantidad_requerida!: number;

  @ApiProperty({ example: 1 })
  usuario_modificacion!: number;
}
