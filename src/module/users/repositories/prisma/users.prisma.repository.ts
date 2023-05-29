import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../users.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../entities/user.entity';
import { PrismaService } from 'src/database/prisma.service';
import { plainToInstance } from 'class-transformer';
import { UserPhone } from '../../entities/user_phone.entity';
import { UserEmail } from '../../entities/user_email.entity';

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
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        email: {
          select: {
            email: true,
            id: true,
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

  async findOne(id: string): Promise<User> {
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

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const { phone, email, ...rest } = data;
    const findUser = await this.prisma.user.findUnique({
      where: { id },
    });
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
  async updateEmail(emailId: string, email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async updatePhone(phoneId: string, phone: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
