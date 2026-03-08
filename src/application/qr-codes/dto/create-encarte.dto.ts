import { IsInt, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEncarteDto {
  @ApiProperty({ description: 'ID do Template' })
  @IsInt()
  templateId: number;

  @ApiProperty({
    description: 'ID do Estabelecimento (para modo STORE)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  establishmentId?: number;

  @ApiProperty({
    description: 'ID da Localidade (para modo CITY_SEGMENT)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  locationId?: number;

  @ApiProperty({
    description: 'IDs dos Segmentos (para modo CITY_SEGMENT)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  segmentIds?: number[];

  @ApiProperty({ description: 'Título do Encarte' })
  @IsString()
  titulo: string;

  @ApiProperty({ description: 'Descrição opcional', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;
}
