import { randomUUID } from 'node:crypto';

export class UserContact {
  readonly id: string;
  user_id: string;
  contact_id: string;
  constructor() {
    this.id = randomUUID();
  }
}
