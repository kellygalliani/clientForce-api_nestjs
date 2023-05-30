import { UserEmail } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UpdateUserEmailDto } from '../dto/update-userEmail.dto';

export abstract class UsersRepository {
  abstract create(data: CreateUserDto): Promise<User> | User;
  abstract findAll(userLoggedId: string): Promise<User[] | User> | User[];
  abstract findOne(id: string, userLoggedId: string): Promise<User> | User;
  abstract findByEmail(
    email: string,
  ): Promise<{ userEmail: UserEmail; user: User }>;
  abstract update(
    id: string,
    data: UpdateUserDto,
    userLoggedId: string,
  ): Promise<User> | User;
  abstract updateEmail(
    emailId: string,
    data: UpdateUserEmailDto,
    userLoggedId: string,
  ): Promise<User> | User;
  abstract updatePhone(
    phoneId: string,
    phone: string,
    userLoggedId: string,
  ): Promise<User> | User;
  abstract delete(id: string, userLoggedId: string): Promise<void> | void;
}
