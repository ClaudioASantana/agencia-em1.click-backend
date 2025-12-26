import { Entity } from '../../../domain/entity';

export interface UserProps {
  name: string;
  email: string;
  createdAt: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(props: UserProps, id?: string): User {
    // Add validation logic here
    return new User(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }
}
