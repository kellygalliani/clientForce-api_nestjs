import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.create(createUserDto);
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.findAll();
    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.update(id, updateUserDto);
    return user;
  }

  updateEmail(emailId: string, email: string) {
    // lógica para modificar ou criar um novo e-mail
  }

  updatePhone(phoneId: string, phone: string) {
    // lógica para modificar ou criar um novo e-mail
  }

  async remove(id: string) {
    await this.usersRepository.delete(id);
    return;
  }
}
