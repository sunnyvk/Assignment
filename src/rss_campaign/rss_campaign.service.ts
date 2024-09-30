


import { Injectable } from '@nestjs/common';
import * as Parser from 'rss-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RssItem } from './rss_item.entity';

@Injectable()
export class RssCampaignService {
  fetchLatestRssFeed() {
    throw new Error('Method not implemented.');
  }
  private parser: Parser;

  
  constructor(
    @InjectRepository(RssItem)
    private rssItemRepository: Repository<RssItem>,
  ) {
    this.parser = new Parser();
  }

  async checkForNewEntries(feedUrl: string) {
    const feed = await this.parser.parseURL(feedUrl);
    for(const item of feed.items){
    const latestItem = await this.rssItemRepository.findOne({
      order: { pubDate: 'DESC' },
      where: { title: item.title }
      
    });
    
    // const rssItem = await this.rssRepository.findOne({ where: { id: rssItemId } });


    const newItems = feed.items.filter(item => {
      const pubDate = new Date(item.pubDate);
      return !latestItem || pubDate > latestItem.pubDate;
    });

    if (newItems.length > 0) {
      const latestNewItem = newItems[0];
      const newRssItem = this.rssItemRepository.create({
        title: latestNewItem.title,
        pubDate: new Date(latestNewItem.pubDate),
      });
      await this.rssItemRepository.save(newRssItem);
    }
    return newItems;
  }
  
  }
}

