import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RssCampaignService } from './rss_campaign.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class RssCampaignScheduler {
  constructor(
    private readonly rssCampaignService: RssCampaignService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR) // Runs every hour
  async handleCron() {
    const feedUrl = 'http://feeds.bbci.co.uk/news/rss.xml';
    const newItems = await this.rssCampaignService.checkForNewEntries(feedUrl);

    if (newItems.length > 0) {
      const emailContent = this.generateEmailContent(newItems);
      const subscribers = ['vejer88174@rinseart.com', 'sunnyvk2789@gmail.com'];

      for (const subscriber of subscribers) {
        await this.emailService.sendEmailToSubscribers([subscriber], 'New RSS Feed Content', emailContent);
      }
    }
  }

  private generateEmailContent(items: any[]) {
    return items.map(item => `<h2>${item.title}</h2><p>${item.contentSnippet}</p>`).join('<hr>');
  }
}
