import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSegmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
