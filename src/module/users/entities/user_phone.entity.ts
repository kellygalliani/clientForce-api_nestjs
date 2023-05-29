import { randomUUID } from 'node:crypto';

export class UserPhone {
  readonly id: string;
  user_id: string;
  phone: string;

  constructor() {
    this.id = randomUUID();
  }
}
