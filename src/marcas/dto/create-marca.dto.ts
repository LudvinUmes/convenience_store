import { ApiProperty } from '@nestjs/swagger';

export class CreateMarcaDto {
  @ApiProperty({ example: 'Coca-Cola' })
  nombre!: string;

  @ApiProperty({ example: 1 })
  usuario_creacion!: number;
}
