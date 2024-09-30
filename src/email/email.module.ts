import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MailerModule.forRootAsync({
            useFactory: async () => ({
                transport: {
                    host: process.env.mail_host || 'smtp.gmail.com',
                    port: parseInt(process.env.mail_port, 10) || 587,
                    secure: false,
                    auth: {
                        user: process.env.mail_user,
                        pass: process.env.mail_password,
                    },
                    tls: {
                        rejectUnauthorized: false, // This will bypass the self-signed certificate issue
                      },
                },
                defaults: {
                    from: `"No Reply" <no-reply@zasset.com>`,
                },
                // template: {
                //     dir: join(__dirname, './templates'),
                //     adapter: new HandlebarsAdapter(),
                //     options: {
                //         strict: true,
                //     },
                // },
            }),
            // inject: [ConfigService],
        }),
        // ConfigModule,
    ],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }