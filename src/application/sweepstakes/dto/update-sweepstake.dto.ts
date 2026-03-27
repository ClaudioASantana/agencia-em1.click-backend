import { PartialType } from '@nestjs/mapped-types';
import { CreateSweepstakeDto } from './create-sweepstake.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSweepstakeDto extends PartialType(CreateSweepstakeDto) {
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
