import { Test, TestingModule } from '@nestjs/testing';
import { NamedController } from './named.controller';

describe('NamedController', () => {
  let controller: NamedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NamedController],
    }).compile();

    controller = module.get<NamedController>(NamedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
