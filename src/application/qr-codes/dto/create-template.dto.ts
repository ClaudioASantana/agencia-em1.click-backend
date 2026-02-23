import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  totalSlots: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
