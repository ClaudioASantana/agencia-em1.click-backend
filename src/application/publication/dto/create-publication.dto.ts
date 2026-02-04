import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePublicationDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsInt()
  establishmentId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  offerIds?: number[];

  @IsString()
  @IsOptional()
  priority?: string;
}
