import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContactsRepository } from '../contacts.repository';
import { CreateContactDto } from '../../dto/create-contact.dto';
import { UpdateContactDto } from '../../dto/update-contact.dto';
import { Contact } from '../../entities/contact.entity';
import { PrismaService } from 'src/database/prisma.service';
import { ContactEmail } from '../../entities/contact_email.entity';
import { ContactPhone } from '../../entities/contact_phone.entity';
import { UserContact } from '../../entities/user_contact.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ContactsPrismaRepository implements ContactsRepository {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateContactDto, userLoggedId: string): Promise<Contact> {
    const { email, phone, ...rest } = data;
    const contact = new Contact();

    const newContactEmail = new ContactEmail();
    Object.assign(newContactEmail, { email });

    const newContactPhone = new ContactPhone();
    Object.assign(newContactPhone, { phone });

    const newUserContact = new UserContact();
    Object.assign(newUserContact, { user_id: userLoggedId });

    Object.assign(contact, rest);

    const newContact = await this.prisma.contact.create({
      data: {
        ...contact,
        emails: { create: [{ ...newContactEmail }] },
        phones: { create: [{ ...newContactPhone }] },
        UserContact: { create: [{ ...newUserContact }] },
      },
      include: {
        emails: true,
        phones: true,
      },
    });

    return plainToInstance(Contact, newContact);
  }

  async findAll(userLoggedId: string): Promise<Contact[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
      select: { isAdmin: true },
    });

    let where = {};
    if (!user.isAdmin) {
      where = {
        UserContact: {
          some: {
            user_id: userLoggedId,
          },
        },
      };
    }

    const contacts = await this.prisma.contact.findMany({
      where,
      include: {
        emails: {
          select: {
            id: true,
            email: true,
          },
        },
        phones: {
          select: {
            id: true,
            phone: true,
          },
        },
        UserContact: {
          select: {
            user_id: true,
          },
        },
      },
    });

    return contacts;
  }

  async findOne(id: string, userLoggedId: string): Promise<Contact> {
    const userLogged = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
      select: { isAdmin: true },
    });

    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        emails: {
          select: {
            id: true,
            email: true,
          },
        },
        phones: {
          select: {
            id: true,
            phone: true,
          },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const isContactOwner = !!(await this.prisma.userContact.findFirst({
      where: {
        contact_id: id,
        user_id: userLoggedId,
      },
    }));

    if (!isContactOwner && !userLogged.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    return contact;
  }

  async findByEmail(
    email: string,
    userLoggedId: string,
  ): Promise<{ contactEmail: ContactEmail; contact: Contact } | null> {
    const contactEmail = await this.prisma.contactEmail.findFirst({
      where: { email },
      include: {
        contact: {
          include: {
            UserContact: true,
          },
        },
      },
    });

    if (
      !contactEmail ||
      !contactEmail.contact.UserContact.some(
        (userContact) => userContact.user_id === userLoggedId,
      )
    ) {
      return null;
    }

    return {
      contactEmail,
      contact: contactEmail.contact,
    };
  }

  async update(
    id: string,
    data: UpdateContactDto,
    userLoggedId: string,
  ): Promise<Contact> {
    const { email, phone, ...rest } = data;
    const findContact = await this.prisma.contact.findUnique({
      where: { id },
    });
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
      select: { isAdmin: true },
    });
    const isContactOwner = !!(await this.prisma.userContact.findFirst({
      where: {
        contact_id: id,
        user_id: userLoggedId,
      },
    }));
    if (!isContactOwner && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }
    if (!findContact) {
      throw new NotFoundException('Contact not found!');
    }
    //find email or create email
    if (email) {
      const existingEmail = await this.prisma.contactEmail.findFirst({
        where: { email },
      });
      if (existingEmail) {
        if (existingEmail.contact_id === id) {
          throw new ConflictException('Email already exists for this contact');
        }
      } else {
        await this.prisma.contactEmail.create({
          data: {
            email,
            contact: { connect: { id } },
          },
        });
      }
    }
    //find phone or create phone
    if (phone) {
      const existingPhone = await this.prisma.contactPhone.findFirst({
        where: { phone },
      });
      if (existingPhone) {
        if (existingPhone.contact_id === id) {
          throw new ConflictException('Phone already exists for this contact');
        }
      } else {
        await this.prisma.contactPhone.create({
          data: {
            phone,
            contact: { connect: { id } },
          },
        });
      }
    }
    const contact = await this.prisma.contact.update({
      where: { id },
      data: { ...rest },
      include: {
        emails: {
          select: {
            email: true,
            id: true,
          },
        },
        phones: {
          select: {
            phone: true,
            id: true,
          },
        },
        UserContact: {
          select: {
            user_id: true,
          },
        },
      },
    });
    return contact;
  }

  async updateEmail(
    emailId: string,
    email: string,
    userLoggedId: string,
  ): Promise<Contact> {
    const contactEmail = await this.prisma.contactEmail.findUnique({
      where: { id: emailId },
      include: { contact: { include: { UserContact: true } } },
    });
    if (!contactEmail) {
      throw new NotFoundException('Email not found!');
    }
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
      select: { isAdmin: true },
    });

    const isContactOwner = contactEmail.contact.UserContact.some(
      (userContact) => userContact.user_id === userLoggedId,
    );

    if (!isContactOwner && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    const existingEmail = await this.prisma.contactEmail.findFirst({
      where: { email },
    });

    if (existingEmail) {
      if (existingEmail.contact_id === contactEmail.contact_id) {
        if (existingEmail.id === contactEmail.id) {
          throw new ConflictException('Email already exists for this contact');
        }
      }
    }

    await this.prisma.contactEmail.update({
      where: { id: emailId },
      data: { email },
    });
    return this.prisma.contact.findUnique({
      where: { id: contactEmail.contact_id },
      include: {
        emails: {
          select: {
            email: true,
            id: true,
          },
        },
        phones: {
          select: {
            phone: true,
            id: true,
          },
        },
        UserContact: {
          select: {
            user_id: true,
          },
        },
      },
    });
  }

  async deleteEmail(emailId: string, userLoggedId: string): Promise<void> {
    const contactEmail = await this.prisma.contactEmail.findUnique({
      where: { id: emailId },
      include: { contact: { include: { UserContact: true } } },
    });
    if (!contactEmail) {
      throw new NotFoundException('Email not found!');
    }
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
      select: { isAdmin: true },
    });

    const isContactOwner = contactEmail.contact.UserContact.some(
      (userContact) => userContact.user_id === userLoggedId,
    );

    if (!(!isContactOwner && !currentUser.isAdmin)) {
      throw new ForbiddenException('Permission denied');
    }
    await this.prisma.contactEmail.delete({
      where: { id: emailId },
    });
  }

  async updatePhone(
    phoneId: string,
    phone: string,
    userLoggedId: string,
  ): Promise<Contact> {
    const contactPhone = await this.prisma.contactPhone.findUnique({
      where: { id: phoneId },
      include: { contact: { include: { UserContact: true } } },
    });
    if (!contactPhone) {
      throw new NotFoundException('Phone not found!');
    }
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
      select: { isAdmin: true },
    });

    const isContactOwner = contactPhone.contact.UserContact.some(
      (userContact) => userContact.user_id === userLoggedId,
    );
    if (!isContactOwner && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    const existingPhone = await this.prisma.contactPhone.findFirst({
      where: { phone },
    });

    if (existingPhone) {
      if (existingPhone.contact_id === contactPhone.contact_id) {
        if (existingPhone.id === contactPhone.id) {
          throw new ConflictException('Phone already exists for this contact');
        }
      }
    }

    await this.prisma.contactPhone.update({
      where: { id: phoneId },
      data: { phone },
    });
    return this.prisma.contact.findUnique({
      where: { id: contactPhone.contact_id },
      include: {
        emails: {
          select: {
            email: true,
            id: true,
          },
        },
        phones: {
          select: {
            phone: true,
            id: true,
          },
        },
        UserContact: {
          select: {
            user_id: true,
          },
        },
      },
    });
  }

  async deletePhone(phoneId: string, userLoggedId: string): Promise<void> {
    const contactPhone = await this.prisma.contactPhone.findUnique({
      where: { id: phoneId },
      include: { contact: { include: { UserContact: true } } },
    });
    if (!contactPhone) {
      throw new NotFoundException('Phone not found!');
    }
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
      select: { isAdmin: true },
    });
    if (!currentUser) {
      throw new Error('User not found');
    }
    const isContactOwner = contactPhone.contact.UserContact.some(
      (userContact) => userContact.user_id === userLoggedId,
    );
    if (!(!isContactOwner && !currentUser.isAdmin)) {
      throw new ForbiddenException('Permission denied');
    }
    await this.prisma.contactPhone.delete({
      where: { id: phoneId },
    });
  }

  async delete(id: string, userLoggedId: string): Promise<void> {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: { UserContact: true },
    });
    if (!contact) {
      throw new NotFoundException('Contact not found!');
    }
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userLoggedId },
      select: { isAdmin: true },
    });

    const isContactOwner = contact.UserContact.some(
      (userContact) => userContact.user_id === userLoggedId,
    );
    if (!isContactOwner && !currentUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }
    await this.prisma.contact.delete({
      where: { id },
    });
  }
}
