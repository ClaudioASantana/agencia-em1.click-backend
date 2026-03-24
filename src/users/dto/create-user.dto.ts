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

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'João Silva', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'STORE_OWNER',
    required: false,
    enum: ['ADMIN', 'STORE_OWNER'],
  })
  @IsOptional()
  @IsIn(['ADMIN', 'STORE_OWNER'])
  role?: string;

  @ApiProperty({ example: 'Minha Loja', required: false })
  @IsOptional()
  @IsString()
  storeName?: string;

  @ApiProperty({ example: [1, 2], required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  establishmentIds?: number[];
}
