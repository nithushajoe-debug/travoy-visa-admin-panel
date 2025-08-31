import { Injectable, ForbiddenException } from '@nestjs/common';
import { PERMISSIONS } from '@travoy/shared';
import { SendEmailDto } from './dto/send-email.dto';
import { SendWhatsAppDto } from './dto/send-whatsapp.dto';

@Injectable()
export class MessagesService {
  async sendEmail(dto: SendEmailDto, user: any) {
    if (!user.permissions.includes(PERMISSIONS.MSG_SEND_EMAIL)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // In real implementation, this would queue the email via BullMQ
    console.log('Queueing email:', dto);

    return {
      success: true,
      message: 'Email queued for sending',
      messageId: `email_${Date.now()}`,
    };
  }

  async sendWhatsApp(dto: SendWhatsAppDto, user: any) {
    if (!user.permissions.includes(PERMISSIONS.MSG_SEND_WHATSAPP)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // In real implementation, this would queue the WhatsApp message via BullMQ
    console.log('Queueing WhatsApp:', dto);

    return {
      success: true,
      message: 'WhatsApp message queued for sending',
      messageId: `wa_${Date.now()}`,
    };
  }
}