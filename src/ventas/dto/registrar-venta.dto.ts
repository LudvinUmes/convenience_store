import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class DetalleVentaDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'ID del producto vendido, si aplica',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value === 0 ? null : value)) // CLAVE: Convertir 0 a null
  id_producto?: number;

  @ApiPropertyOptional({
    description: 'ID del combo al que pertenece el producto, si aplica',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value === 0 ? null : value)) // CLAVE: Convertir 0 a null
  id_combo?: number;

  @ApiProperty({ example: 3, description: 'Cantidad de unidades vendidas' })
  @IsInt()
  cantidad!: number;
}

class PagoDto {
  @ApiProperty({ example: 'EFECTIVO', description: 'Método de pago utilizado' })
  @IsString()
  metodo_pago!: string;

  // CORREGIDO: En los ejemplos del SP, monto es 0, sugiere que se calcula automáticamente
  @ApiProperty({ example: 0, description: 'Monto pagado con este método' })
  @IsNumber()
  monto!: number;
}

export class RegistrarVentaDto {
  @ApiProperty({ example: 'COMPLETADA', description: 'Estado de la venta' })
  @IsString()
  estado_venta!: string;

  @ApiPropertyOptional({
    example: 'Cliente frecuente',
    description: 'Observaciones adicionales',
  })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({
    example: '1234567-0',
    description: 'NIT del cliente (opcional)',
  })
  @IsOptional()
  @IsString()
  nit?: string;

  @ApiPropertyOptional({
    example: 'Carlos Pérez',
    description: 'Nombre del cliente (opcional)',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 1, description: 'ID del usuario que creó la venta' })
  @IsInt()
  usuario_creacion!: number;

  @ApiProperty({
    type: [DetalleVentaDto],
    description: 'Listado de detalles de la venta',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles!: DetalleVentaDto[];

  @ApiProperty({
    type: [PagoDto],
    description: 'Listado de métodos de pago aplicados',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PagoDto)
  pagos!: PagoDto[];
}
