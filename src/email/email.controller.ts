import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Get('send')
    async sendEmail() {
        const to = "khambayatsunny278@gmail.com";
        const subject = "testing";
        const text = "it working or not";
        const recipients = Array.isArray(to) ? to : [to];
        await this.emailService.sendEmailToSubscribers(recipients, subject, text);
        return { message: 'Email sent successfully' };
    }
}

