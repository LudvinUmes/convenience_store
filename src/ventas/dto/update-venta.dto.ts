import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVentaDto {
  @ApiProperty({ example: 1, description: 'ID de la venta a actualizar' })
  @IsInt()
  id_venta!: number;

  @ApiPropertyOptional({
    example: 'ANULADA',
    description: 'Nuevo estado de la venta',
  })
  @IsOptional()
  @IsString()
  estado_venta?: string;

  @ApiPropertyOptional({
    example: 'Cliente canceló la compra',
    description: 'Observaciones',
  })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({
    example: '9876543-1',
    description: 'Nuevo NIT del cliente',
  })
  @IsOptional()
  @IsString()
  nit?: string;

  @ApiPropertyOptional({
    example: 'María López',
    description: 'Nuevo nombre del cliente',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({
    example: 2,
    description: 'ID del usuario que realiza la modificación',
  })
  @IsInt()
  usuario_modificacion!: number;
}
