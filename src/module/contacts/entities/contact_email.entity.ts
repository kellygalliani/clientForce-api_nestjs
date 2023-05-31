import { randomUUID } from 'node:crypto';

export class ContactEmail {
  readonly id: string;
  contact_id: string;
  email: string;

  constructor() {
    this.id = randomUUID();
  }
}
