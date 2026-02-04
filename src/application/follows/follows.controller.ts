import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FollowsService } from './follows.service';

@Controller('establishments/:id/follow')
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Post()
  async follow(@Param('id') id: string, @Req() req: any) {
    return this.followsService.follow(req.user.userId, Number(id));
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(@Param('id') id: string, @Req() req: any) {
    return this.followsService.unfollow(req.user.userId, Number(id));
  }
}
