import { Module } from '@nestjs/common';
import { UsersModule } from './module/users/users.module';
import { ContactsModule } from './module/contacts/contacts.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [UsersModule, ContactsModule, AuthModule],
})
export class AppModule {}
