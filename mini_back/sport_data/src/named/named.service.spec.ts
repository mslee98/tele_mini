import { Test, TestingModule } from '@nestjs/testing';
import { NamedService } from './named.service';

describe('NamedService', () => {
  let service: NamedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NamedService],
    }).compile();

    service = module.get<NamedService>(NamedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
