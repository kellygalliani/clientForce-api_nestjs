import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../entities/user.entity';
import { UserEmail } from '../../entities/user_email.entity';
import { UserPhone } from '../../entities/user_phone.entity';
import { UsersRepository } from '../users.repository';
import { plainToInstance } from 'class-transformer';

export class UsersInMemoryRepository implements UsersRepository {
  private database: User[] = [];
  private userEmailsDatabase: UserEmail[] = [];
  private userPhonesDatabase: UserPhone[] = [];

  create(data: CreateUserDto): User {
    const newUser = new User();
    const { name, password, isAdmin, avatar, phone, email } = data;

    Object.assign(newUser, {
      ...data,
      isAdmin: data.isAdmin || false,
      avatar: data.avatar || '',
    });

    this.database.push(newUser);

    const newUserPhone = new UserPhone();
    Object.assign(newUserPhone, { user_id: newUser.id, phone });
    this.userPhonesDatabase.push(newUserPhone);

    const newUserEmail = new UserEmail();
    Object.assign(newUserEmail, { user_id: newUser.id, email });
    this.userEmailsDatabase.push(newUserEmail);

    const userWithPhonesAndEmails = {
      ...newUser,
      phone: this.userPhonesDatabase
        .filter((phone) => phone.user_id === newUser.id)
        .map((phone) => ({ phone: phone.phone, id: phone.id })),
      email: this.userEmailsDatabase
        .filter((email) => email.user_id === newUser.id)
        .map((email) => ({ email: email.email, id: email.id })),
    };

    return plainToInstance(User, userWithPhonesAndEmails);
  }
  findAll(): User[] | Promise<User[]> {
    return plainToInstance(User, this.database);
  }
  findOne(id: string): User | Promise<User> {
    const userIndex = this.database.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    const user = this.database.find((user) => user.id === id);
    return plainToInstance(User, user);
  }
  update(id: string, data: UpdateUserDto): User | Promise<User> {
    const userIndex = this.database.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    if (data.email) {
      const emailIndex = this.userEmailsDatabase.findIndex(
        (email) => email.email === data.email,
      );
      if (
        emailIndex !== -1 &&
        this.userEmailsDatabase[emailIndex].user_id !== id
      ) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      if (
        emailIndex !== -1 &&
        this.userEmailsDatabase[emailIndex].user_id === id
      ) {
        this.userEmailsDatabase[emailIndex].email = data.email;
      } else {
        const newUserEmail = new UserEmail();
        Object.assign(newUserEmail, { user_id: id, email: data.email });
        this.userEmailsDatabase.push(newUserEmail);
      }
    }

    if (data.phone) {
      const phoneIndex = this.userPhonesDatabase.findIndex(
        (phone) => phone.phone === data.phone,
      );
      if (
        phoneIndex !== -1 &&
        this.userPhonesDatabase[phoneIndex].user_id !== id
      ) {
        throw new HttpException('Phone already exists', HttpStatus.CONFLICT);
      }
      if (
        phoneIndex !== -1 &&
        this.userPhonesDatabase[phoneIndex].user_id === id
      ) {
        this.userPhonesDatabase[phoneIndex].phone = data.phone;
      } else {
        const newUserPhone = new UserPhone();
        Object.assign(newUserPhone, { user_id: id, phone: data.phone });
        this.userPhonesDatabase.push(newUserPhone);
      }
    }

    this.database[userIndex] = { ...this.database[userIndex], ...data };

    const updatedUser = this.database[userIndex];
    const userWithPhonesAndEmails = {
      ...updatedUser,
      phone: this.userPhonesDatabase
        .filter((phone) => phone.user_id === updatedUser.id)
        .map((phone) => ({ phone: phone.phone, id: phone.id })),
      email: this.userEmailsDatabase
        .filter((email) => email.user_id === updatedUser.id)
        .map((email) => ({ email: email.email, id: email.id })),
    };

    return plainToInstance(User, userWithPhonesAndEmails);
  }

  updateEmail(emailId: string, email: string): User | Promise<User> {
    return;
  }
  updatePhone(phoneId: string, phone: string): User | Promise<User> {
    return;
  }

  delete(id: string): void | Promise<void> {
    const userIndex = this.database.findIndex((user) => user.id === id);
    this.database.splice(userIndex, 1);
  }
}
