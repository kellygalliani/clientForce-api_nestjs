import { Exclude } from 'class-transformer';
import { randomUUID } from 'node:crypto';

export class Contact {
  readonly id: string;
  name: string;
  createdAt: Date;

  constructor() {
    this.id = randomUUID();
    this.createdAt = new Date();
  }
}
