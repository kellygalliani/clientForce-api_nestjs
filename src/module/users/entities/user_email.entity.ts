import { randomUUID } from 'node:crypto';

export class UserEmail {
  readonly id: string;
  user_id: string;
  email: string;

  constructor() {
    this.id = randomUUID();
  }
}
