import { Test, TestingModule } from '@nestjs/testing';
import { ContractManagementService } from './contractManagement.service';

describe('ContractManagementService', () => {
  let service: ContractManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractManagementService],
    }).compile();

    service = module.get<ContractManagementService>(ContractManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});