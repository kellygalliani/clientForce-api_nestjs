import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract create(data: CreateUserDto): Promise<User> | User;
  abstract findAll(): Promise<User[]> | User[];
  abstract findOne(id: string): Promise<User> | User;
  abstract update(id: string, data: UpdateUserDto): Promise<User> | User;
  abstract updateEmail(emailId: string, email: string): Promise<User> | User;
  abstract updatePhone(phoneId: string, phone: string): Promise<User> | User;
  abstract delete(id: string): Promise<void> | void;
}
