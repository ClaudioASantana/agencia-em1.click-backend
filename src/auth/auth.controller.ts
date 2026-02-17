import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Param,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    const userDto = {
      ...registerDto,
      role: registerDto.role || 'STORE_OWNER',
    };
    return this.usersService.create(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    const user = await this.authService.validateUser(
      signInDto.email,
      signInDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('impersonate/:establishmentId')
  @UseGuards(JwtAuthGuard)
  async impersonate(
    @Param('establishmentId') establishmentId: string,
    @Req() req: any,
  ) {
    const user = req.user;

    // TODO: Ideally use a RolesGuard(Role.ADMIN)
    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('Only admins can impersonate');
    }

    return this.authService.impersonate(Number(establishmentId), user);
  }
  @Post('impersonate-user/:userId')
  @UseGuards(JwtAuthGuard)
  async impersonateUser(@Param('userId') userId: string, @Req() req: any) {
    const user = req.user;

    // TODO: Ideally use a RolesGuard(Role.ADMIN)
    const isAdmin =
      user.role === 'ADMIN' || (!user.role && !user.establishmentId);

    if (!isAdmin) {
      throw new UnauthorizedException(
        'Apenas administradores podem realizar impersonação',
      );
    }

    return this.authService.impersonateUser(Number(userId));
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetDto: any) {
    return this.authService.resetPassword(resetDto.token, resetDto.password);
  }
}
