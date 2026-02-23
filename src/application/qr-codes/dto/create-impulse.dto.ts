import { IsInt } from 'class-validator';

export class CreateImpulseDto {
  @IsInt()
  establishmentId: number;

  @IsInt()
  templateId: number;
}
