import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Snacks' })
  @IsString()
  nombre!: string;

  @ApiProperty({
    example: 'Comidas empacadas como papas, galletas, etc.',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  usuario_creacion!: number;
}
