import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  create(@Body() createContactDto: CreateContactDto, @Request() Req) {
    return this.contactsService.create(createContactDto, Req.user.id);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  findAll(@Request() Req) {
    return this.contactsService.findAll(Req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() Req) {
    return this.contactsService.findOne(id, Req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Request() Req,
  ) {
    return this.contactsService.update(id, updateContactDto, Req.user.id);
  }
  @Patch('email/:emailId')
  @UseGuards(JwtAuthGuard)
  updateEmail(
    @Param('emailId') emailId: string,
    @Body('email') email: string,
    @Request() Req,
  ) {
    return this.contactsService.updateEmail(emailId, email, Req.user.id);
  }
  @Delete('email/:emailId')
  @UseGuards(JwtAuthGuard)
  deleteEmail(@Param('emailId') emailId: string, @Request() Req) {
    return this.contactsService.deleteEmail(emailId, Req.user.id);
  }

  @Patch('phone/:phoneId')
  @UseGuards(JwtAuthGuard)
  updatePhone(
    @Param('phoneId') phoneId: string,
    @Body('phone') phone: string,
    @Request() Req,
  ) {
    return this.contactsService.updatePhone(phoneId, phone, Req.user.id);
  }

  @Delete('phone/:phoneId')
  @UseGuards(JwtAuthGuard)
  deletePhone(@Param('phoneId') phoneId: string, @Request() Req) {
    return this.contactsService.deletePhone(phoneId, Req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() Req) {
    return this.contactsService.remove(id, Req.user.id);
  }
}
