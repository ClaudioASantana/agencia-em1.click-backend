import { PartialType } from '@nestjs/swagger';
import { CreateSweepstakeDto } from './create-sweepstake.dto';

export class UpdateSweepstakeDto extends PartialType(CreateSweepstakeDto) {}
