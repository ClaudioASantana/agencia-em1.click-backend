import {
  IsInt,
  IsPositive,
  IsString,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @Matches(/^\+55\d{10,11}$/, {
    message: 'Número de WhatsApp inválido. Use o formato +5511999999999',
  })
  phone: string;

  @IsInt()
  @IsPositive()
  establishmentId: number;

  @IsOptional()
  @IsInt()
  shareTokenId?: number;

  @IsString()
  consentText: string;
}
