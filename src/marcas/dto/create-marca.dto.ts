import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMarcaDto {
  @ApiProperty({ example: 'Coca-Cola' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  usuario_creacion!: number;
}
