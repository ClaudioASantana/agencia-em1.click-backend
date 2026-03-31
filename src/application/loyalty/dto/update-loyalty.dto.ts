import { PartialType } from '@nestjs/swagger';
import { CreateLoyaltyDto } from './create-loyalty.dto';

export class UpdateLoyaltyDto extends PartialType(CreateLoyaltyDto) {}
