import { Exclude } from 'class-transformer';
import { randomUUID } from 'node:crypto';

export class User {
  readonly id: string;
  name: string;

  @Exclude()
  password: string;

  avatar: string;
  isAdmin: boolean;
  createdAt: Date;
  isActive: boolean;

  constructor() {
    this.id = randomUUID();
    this.createdAt = new Date();
  }
}
