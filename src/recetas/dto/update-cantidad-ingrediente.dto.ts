import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCantidadDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1, { message: 'La cantidad requerida debe ser al menos 1' })
  cantidad_requerida!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  usuario_modificacion!: number;
}
