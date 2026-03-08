import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
  IsIn,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ required: false, enum: ['ADMIN', 'STORE_OWNER'] })
  @IsOptional()
  @IsIn(['ADMIN', 'STORE_OWNER'])
  role?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  establishmentIds?: number[];
}
