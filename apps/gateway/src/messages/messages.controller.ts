import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { SendEmailDto } from './dto/send-email.dto';
import { SendWhatsAppDto } from './dto/send-whatsapp.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Send email' })
  @Post('email/send')
  async sendEmail(@Body() dto: SendEmailDto, @Request() req) {
    return this.messagesService.sendEmail(dto, req.user);
  }

  @ApiOperation({ summary: 'Send WhatsApp message' })
  @Post('whatsapp/send')
  async sendWhatsApp(@Body() dto: SendWhatsAppDto, @Request() req) {
    return this.messagesService.sendWhatsApp(dto, req.user);
  }
}