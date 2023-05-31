import { ContactEmail } from '@prisma/client';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from '../dto/create-contact.dto';

export abstract class ContactsRepository {
  abstract create(
    data: CreateContactDto,
    userLoggedId: string,
  ): Promise<Contact> | Contact;
  abstract findAll(
    userLoggedId: string,
  ): Promise<Contact[] | Contact> | Contact[];
  abstract findOne(
    id: string,
    userLoggedId: string,
  ): Promise<Contact> | Contact;
  abstract findByEmail(
    email: string,
    userLoggedId: string,
  ): Promise<{ contactEmail: ContactEmail; contact: Contact }>;
  abstract update(
    id: string,
    data: UpdateContactDto,
    contactLoggedId: string,
  ): Promise<Contact> | Contact;
  abstract updateEmail(
    emailId: string,
    email: string,
    contactLoggedId: string,
  ): Promise<Contact> | Contact;
  abstract deleteEmail(
    emailId: string,
    contactLoggedId: string,
  ): Promise<void> | void;
  abstract updatePhone(
    phoneId: string,
    phone: string,
    contactLoggedId: string,
  ): Promise<Contact> | Contact;
  abstract deletePhone(
    phoneId: string,
    contactLoggedId: string,
  ): Promise<void> | void;
  abstract delete(id: string, contactLoggedId: string): Promise<void> | void;
}
