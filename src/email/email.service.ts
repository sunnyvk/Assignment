



import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
// import { RssCampaignService} from './rss_campaign/rss_campaign.service';  // Make sure RssService is imported
import { RssCampaignService } from './../rss_campaign/rss_campaign.service';
@Injectable()

export class EmailService {
  constructor(private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly rssCampaignService: RssCampaignService 
    ) {}

  // Send dynamic content to a list of subscribers
  async sendEmailToSubscribers(subscribers: string[], subject: string,/* content: string*/  feedUrl: string) {
    const emailProvider = this.configService.get<string>('EMAIL_PROVIDER');

    const rssItems = await this.rssCampaignService.checkForNewEntries(feedUrl);
    let transporterOptions = {};
    if (emailProvider === 'gmail') {
        transporterOptions = {
          service: 'gmail',
          auth: {
            user: this.configService.get<string>('GMAIL_USER'),
            pass: this.configService.get<string>('GMAIL_PASSWORD'),
          },
        };
      } else if (emailProvider === 'sendgrid') {
        transporterOptions = {
          service: 'sendgrid',
          auth: {
            api_key: this.configService.get<string>('SENDGRID_API_KEY'),
          },
        };
    } 
    const rssContent = rssItems.map(item => `<li>${item.title}</li>`).join('');
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
              }
              .container {
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #f9f9f9;
              }
              .header {
                  font-size: 24px;
                  margin-bottom: 20px;
              }
              .content {
                  font-size: 18px;
                  margin-bottom: 20px;
              }
              .footer {
                  font-size: 16px;
                  color: #666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  New Info From Newsletter!
              </div>
              <div class="content">
                  <strong>${rssContent}</strong>
              </div>
              <div class="footer">
                  Thank you,<br>
                  Team Newsletter
              </div>
          </div>
      </body>
      </html>
    `;

    for (const subscriber of subscribers) {
      await this.mailerService.sendMail({
        to: subscriber,
        subject,
        html: emailTemplate,
      });
    }
  }
}
