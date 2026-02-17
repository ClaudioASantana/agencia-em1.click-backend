import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('❌ [JwtAuthGuard] Error:', err);
      console.error('❌ [JwtAuthGuard] Info:', info);
      throw err || new Error('Unauthorized'); // Use simple Error to see if it causes 500 or caught by generic filter
    }
    return user;
  }
}
