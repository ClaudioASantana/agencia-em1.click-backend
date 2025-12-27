import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the user is active',
    required: false,
    default: true,
  })
  active?: boolean;
}
