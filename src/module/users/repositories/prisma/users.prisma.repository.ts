import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { UsersRepository } from '../users.repository';
import { Request } from 'express';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../entities/user.entity';
import { PrismaService } from 'src/database/prisma.service';
import { plainToInstance } from 'class-transformer';
import { UserPhone } from '../../entities/user_phone.entity';
import { UserEmail } from '../../entities/user_email.entity';
import { UpdateUserEmailDto } from '../../dto/update-userEmail.dto';

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const { phone, email, ...rest } = data;
    const user = new User();
    const newUserEmail = new UserEmail();
    const newUserPhone = new UserPhone();
    Object.assign(user, {
      ...rest,
      isAdmin: data.isAdmin || false,
      avatar: data.avatar || '',
      isActive: true,
    });
    Object.assign(newUserEmail, { email });
    Object.assign(newUserPhone, { phone });

    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        email: { create: [{ ...newUserEmail, isPrimary: true }] },
        phone: { create: [{ ...newUserPhone }] },
      },
      include: {
        email: {
          select: {
            email: true,
            id: true,
            isPrimary: true,
          },
        },
        phone: {
          select: {
            phone: true,
            id: true,
          },
        },
      },
    });

    return plainToInstance(User, {
      ...newUser,
    });
  }
  async findAll(userLoggedId: string): Promise<User[] | User> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
    });
    if (!currentUser.isAdmin) {
      const user = await this.prisma.user.findUnique({
        where: { id: userLoggedId },
        include: {
          email: {
            select: {
              email: true,
              id: true,
              isPrimary: true,
            },
          },
          phone: {
            select: {
              phone: true,
              id: true,
            },
          },
        },
      });
      return plainToInstance(User, user);
    }
    const users = await this.prisma.user.findMany({
      include: {
        email: {
          select: {
            email: true,
            id: true,
            isPrimary: true,
          },
        },
        phone: {
          select: {
            phone: true,
            id: true,
          },
        },
      },
    });

    return users.map((user) => plainToInstance(User, user));
  }

  async findOne(id: string, userLoggedId: string): Promise<User> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
    });

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        email: {
          select: {
            email: true,
            id: true,
            isPrimary: true,
          },
        },
        phone: {
          select: {
            phone: true,
            id: true,
          },
        },
        /* contacts: {
          select: {
            name: true,
            id: true,
            createdAt: true,
          },
        }, */
      },
    });
    if (id !== currentUser.id && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return plainToInstance(User, user);
  }
  async findByEmail(
    email: string,
  ): Promise<{ userEmail: UserEmail; user: User }> {
    const userEmail = await this.prisma.userEmail.findFirst({
      where: {
        email,
        isPrimary: true,
      },
      include: {
        user: true,
      },
    });

    if (!userEmail) {
      return null;
    }

    return {
      userEmail,
      user: userEmail.user,
    };
  }

  async update(
    id: string,
    data: UpdateUserDto,
    userLoggedId: string,
  ): Promise<User> {
    const { phone, email, ...rest } = data;
    const findUser = await this.prisma.user.findUnique({
      where: { id },
    });
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
    });
    if (id !== currentUser.id && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }
    if (!findUser) {
      throw new NotFoundException('User not found!');
    }
    //find email or create email
    if (email) {
      const existingEmail = await this.prisma.userEmail.findUnique({
        where: { email },
      });
      if (existingEmail) {
        if (existingEmail.user_id !== id) {
          throw new ConflictException('Email already exists');
        }
        if (existingEmail.user_id === id) {
          throw new ConflictException('Email already exists for this user');
        }
      } else {
        await this.prisma.userEmail.create({
          data: {
            email,
            isPrimary: false,
            user: { connect: { id } },
          },
        });
      }
    }
    //find phone or create phone
    if (phone) {
      const existingphone = await this.prisma.userPhone.findFirst({
        where: { phone },
      });
      if (existingphone) {
        if (existingphone.user_id === id) {
          throw new ConflictException('Phone already exists for this user');
        }
      } else {
        await this.prisma.userPhone.create({
          data: {
            phone,
            user: { connect: { id } },
          },
        });
      }
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: { ...rest },
      include: {
        email: {
          select: {
            email: true,
            id: true,
            isPrimary: true,
          },
        },
        phone: {
          select: {
            phone: true,
            id: true,
          },
        },
      },
    });
    return plainToInstance(User, user);
  }
  async updateEmail(
    emailId: string,
    data: UpdateUserEmailDto,
    userLoggedId: string,
  ): Promise<User> {
    const { isPrimary, email } = data;
    const userEmail = await this.prisma.userEmail.findUnique({
      where: { id: emailId },
    });
    if (!userEmail) {
      throw new NotFoundException('Email not found!');
    }
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
    });
    if (userEmail.user_id !== currentUser.id && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }
    if (email) {
      const existingEmail = await this.prisma.userEmail.findFirst({
        where: { email },
      });
      if (existingEmail) {
        if (existingEmail.user_id === userEmail.user_id) {
          if (existingEmail.id !== userEmail.id) {
            throw new ConflictException('Email already exists for this user');
          }
        } else {
          throw new ConflictException('Email already exists');
        }
      }
    }
    if (isPrimary) {
      await this.prisma.userEmail.updateMany({
        where: { user_id: userEmail.user_id, isPrimary: true },
        data: { isPrimary: false },
      });
    }
    await this.prisma.userEmail.update({
      where: { id: emailId },
      data: { email, isPrimary },
    });
    return this.prisma.user.findUnique({
      where: { id: userEmail.user_id },
      include: {
        email: {
          select: {
            email: true,
            id: true,
            isPrimary: true,
          },
        },
      },
    });
  }

  async deleteEmail(emailId: string, userLoggedId: string): Promise<void> {
    const userEmail = await this.prisma.userEmail.findUnique({
      where: { id: emailId },
    });
    if (!userEmail) {
      throw new NotFoundException('Email not found!');
    }
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
    });
    if (userEmail.user_id !== currentUser.id && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }
    if (userEmail.isPrimary) {
      throw new ForbiddenException('Unable to delete login email');
    }
    await this.prisma.userEmail.delete({
      where: { id: emailId },
    });
  }

  async updatePhone(
    phoneId: string,
    phone: string,
    userLoggedId: string,
  ): Promise<User> {
    const userPhone = await this.prisma.userPhone.findUnique({
      where: { id: phoneId },
    });
    if (!userPhone) {
      throw new NotFoundException('Phone not found!');
    }
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
    });
    if (userPhone.user_id !== currentUser.id && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    await this.prisma.userPhone.update({
      where: { id: phoneId },
      data: { phone },
    });
    return this.prisma.user.findUnique({
      where: { id: userPhone.user_id },
      include: {
        phone: {
          select: {
            phone: true,
            id: true,
          },
        },
      },
    });
  }

  async deletePhone(phoneId: string, userLoggedId: string): Promise<void> {
    const userPhone = await this.prisma.userPhone.findUnique({
      where: { id: phoneId },
    });
    if (!userPhone) {
      throw new NotFoundException('Phone not found!');
    }
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
    });
    if (userPhone.user_id !== currentUser.id && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }
    await this.prisma.userPhone.delete({
      where: { id: phoneId },
    });
  }

  async delete(id: string, userLoggedId: string): Promise<void> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
    });
    if (id !== currentUser.id && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    const userToDelete = await this.prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      throw new NotFoundException('User not found!');
    }
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
