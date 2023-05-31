import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactsRepository } from './repositories/contacts.repository';

@Injectable()
export class ContactsService {
  constructor(private contactsRepository: ContactsRepository) {}

  async create(createContactDto: CreateContactDto, userLoggedId: string) {
    //Aqui preciso verificar se o email já existe para o mesmo usuário
    const findContactEmail = await this.contactsRepository.findByEmail(
      createContactDto.email,
      userLoggedId,
    );
    if (findContactEmail) {
      throw new ConflictException('Contact already exists for this user');
    }
    const contact = await this.contactsRepository.create(
      createContactDto,
      userLoggedId,
    );
    return contact;
  }

  async findAll(userLoggedId: string) {
    const contact = await this.contactsRepository.findAll(userLoggedId);
    return contact;
  }

  async findOne(id: string, userLoggedId: string) {
    const contact = await this.contactsRepository.findOne(id, userLoggedId);
    if (!contact) {
      throw new NotFoundException('User not found!');
    }
    return contact;
  }
  async findByEmail(email: string, userLoggedId: string) {
    const contact = await this.contactsRepository.findByEmail(
      email,
      userLoggedId,
    );
    return contact;
  }
  async update(
    id: string,
    updateContactDto: UpdateContactDto,
    userLoggedId: string,
  ) {
    const contact = await this.contactsRepository.update(
      id,
      updateContactDto,
      userLoggedId,
    );
    return contact;
  }
  async updateEmail(emailId: string, email: string, userLoggedId: string) {
    const emailUpdated = await this.contactsRepository.updateEmail(
      emailId,
      email,
      userLoggedId,
    );
    return emailUpdated;
  }
  async deleteEmail(emailId: string, userLoggedId: string) {
    const emailDeleted = await this.contactsRepository.deleteEmail(
      emailId,
      userLoggedId,
    );
    return emailDeleted;
  }
  async updatePhone(phoneId: string, phone: string, userLoggedId: string) {
    const phoneUpdated = await this.contactsRepository.updatePhone(
      phoneId,
      phone,
      userLoggedId,
    );
    return phoneUpdated;
  }
  async deletePhone(PhoneId: string, userLoggedId: string) {
    const deletedPhone = await this.contactsRepository.deletePhone(
      PhoneId,
      userLoggedId,
    );
    return deletedPhone;
  }
  async remove(id: string, userLoggedId: string) {
    await this.contactsRepository.delete(id, userLoggedId);
    return;
  }
}
