import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsIn(['store_view', 'offer_view', 'whatsapp_click'])
  eventType: string;

  @IsInt()
  establishmentId: number;

  @IsOptional()
  @IsInt()
  offerId?: number;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
