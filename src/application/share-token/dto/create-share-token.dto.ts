import { IsInt, IsPositive } from 'class-validator';

export class CreateShareTokenDto {
  @IsInt()
  @IsPositive()
  establishmentId: number;
}
