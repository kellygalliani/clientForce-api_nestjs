import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserEmailDto } from './dto/update-userEmail.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  findAll(@Request() Req) {
    return this.usersService.findAll(Req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() Req) {
    return this.usersService.findOne(id, Req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() Req,
  ) {
    return this.usersService.update(id, updateUserDto, Req.user.id);
  }
  @Patch('email/:emailId')
  @UseGuards(JwtAuthGuard)
  updateEmail(
    @Param('emailId') emailId: string,
    @Body() data: UpdateUserEmailDto,
    @Request() Req,
  ) {
    return this.usersService.updateEmail(emailId, data, Req.user.id);
  }

  @Patch('phone/:phoneId')
  @UseGuards(JwtAuthGuard)
  updatePhone(
    @Param('phoneId') phoneId: string,
    @Body('phone') phone: string,
    @Request() Req,
  ) {
    return this.usersService.updatePhone(phoneId, phone, Req.user.id);
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() Req) {
    return this.usersService.remove(id, Req.user.id);
  }
}
