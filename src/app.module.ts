import { Module } from '@nestjs/common';
import { UsersModule } from './module/users/users.module';
import { ContactsModule } from './module/contacts/contacts.module';

@Module({
  imports: [UsersModule, ContactsModule],
})
export class AppModule {}
