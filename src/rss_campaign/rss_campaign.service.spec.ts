import { Test, TestingModule } from '@nestjs/testing';
import { RssCampaignService } from './rss_campaign.service';

describe('RssCampaignService', () => {
  let service: RssCampaignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RssCampaignService],
    }).compile();

    service = module.get<RssCampaignService>(RssCampaignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
