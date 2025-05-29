import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Snacks' })
  nombre!: string;

  @ApiProperty({
    example: 'Comidas empacadas como papas, galletas, etc.',
    required: false,
  })
  descripcion?: string;

  @ApiProperty({ example: 1 })
  usuario_creacion!: number;
}
