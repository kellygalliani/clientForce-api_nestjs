import { randomUUID } from 'node:crypto';

export class ContactPhone {
  readonly id: string;
  contact_id: string;
  phone: string;

  constructor() {
    this.id = randomUUID();
  }
}
