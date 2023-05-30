import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { UpdateUserEmailDto } from './dto/update-userEmail.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    const findUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (findUser) {
      throw new ConflictException('User already exists');
    }
    const user = await this.usersRepository.create(createUserDto);
    return user;
  }

  async findAll(userLoggedId: string) {
    const users = await this.usersRepository.findAll(userLoggedId);
    return users;
  }

  async findOne(id: string, userLoggedId: string) {
    const user = await this.usersRepository.findOne(id, userLoggedId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    return user;
  }
  async update(id: string, updateUserDto: UpdateUserDto, userLoggedId: string) {
    const user = await this.usersRepository.update(
      id,
      updateUserDto,
      userLoggedId,
    );
    return user;
  }

  async updateEmail(
    emailId: string,
    data: UpdateUserEmailDto,
    userLoggedId: string,
  ) {
    const emailUpdated = await this.usersRepository.updateEmail(
      emailId,
      data,
      userLoggedId,
    );
    return emailUpdated;
  }

  async updatePhone(phoneId: string, phone: string, userLoggedId: string) {
    const phoneUpdated = await this.usersRepository.updatePhone(
      phoneId,
      phone,
      userLoggedId,
    );
    return phoneUpdated;
  }

  async remove(id: string, userLoggedId: string) {
    await this.usersRepository.delete(id, userLoggedId);
    return;
  }
}
