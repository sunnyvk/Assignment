import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from './organizations/organizations.module';
import { UserModule } from './users/users.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ListsModule } from './lists/lists.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ClickStatsModule } from './click_stats/click_stats.module';
import { AuthModule } from './auth/auth.module';
import { Campaign } from './campaigns/entities/campaign.entity';
import { List } from './lists/entities/list.entity';
import { ClickStat } from './click_stats/entities/click_stat.entity';
import { Organization } from './organizations/entities/organization.entity';
import { Subscriber } from './subscribers/entities/subscriber.entity';
import { User } from './users/entities/user.entity';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task.module';
import { RssCampaignService } from './rss_campaign/rss_campaign.service';
import { EmailService } from './email/email.service';
// import { RssCampaignService } from './rss_campaign/rss_campaign.service';
import { RssItem } from './rss_campaign/rss_item.entity';
import { RssCampaignScheduler } from './rss_campaign/rss_campaign.scheduler';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailerModule } from '@nestjs-modules/mailer';
// import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root123',
      database: 'postgres',
      entities: [Campaign, ClickStat, List, Organization, Subscriber, User,RssItem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([RssItem]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: process.env.EMAIL_PROVIDER, // Set this in .env to 'gmail', 'sparkpost', 'sendgrid', or 'mailgun'
          auth: {
            user: process.env.GMAIL_USER ||  process.env.SPARKPOST_EMAIL_FROM,
            pass: process.env.GMAIL_PASSWORD ||  process.env.SPARKPOST_API_KEY ,
          },
          tls: {
            rejectUnauthorized: false, // This will bypass the self-signed certificate issue
          },
        },
        defaults: {
          from: `"No Reply" <${process.env.GMAIL_USER || process.env.SPARKPOST_EMAIL_FROM }>`,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(), // or another adapter
          options: {
            strict: true,
          },
        },
      }),
    }),
    ScheduleModule.forRoot(),
  

    OrganizationsModule,
    UserModule,
    SubscribersModule,

    ListsModule,
    CampaignsModule,
    ClickStatsModule,
    AuthModule,
    EmailModule,
    ScheduleModule.forRoot(), TasksModule, 
  ],
  controllers: [AppController],
  providers: [AppService,  RssCampaignScheduler, RssCampaignService],
})
export class AppModule { }
