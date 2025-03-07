import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContractDto, BulkCreateContractDto } from 'src/dto/create-contract.dto';
import { IContract } from 'src/interface/contract.interface';
import { Model } from 'mongoose';
import { UpdateContractDto } from 'src/dto/update-contract.dto';

@Injectable()
export class ContractManagementService {
  constructor(
    @InjectModel('Contract') private readonly contractModel: Model<IContract>,
  ) {}

  async createContract(
    createContractDto: CreateContractDto,
  ): Promise<IContract> {
    const existingContract = await this.contractModel.findOne({ contractFGID: createContractDto.contractFGID });
    if (existingContract) {
      throw new BadRequestException(`Contract with FGID ${createContractDto.contractFGID} already exists`);
    }
    const newContract = new this.contractModel(createContractDto);
    return newContract.save();
  }

  async bulkCreateContracts(
    bulkCreateContractDto: BulkCreateContractDto,
  ): Promise<IContract[]> {
    if (!bulkCreateContractDto.contracts || !Array.isArray(bulkCreateContractDto.contracts)) {
      throw new BadRequestException('Invalid input: contracts should be an array');
    }

    const contractFGIDs = bulkCreateContractDto.contracts.map(contract => contract.contractFGID);
    const existingContracts = await this.contractModel.find({ contractFGID: { $in: contractFGIDs } });
    const existingFGIDs = existingContracts.map(contract => contract.contractFGID);

    const duplicates = contractFGIDs.filter((fgid, index) => contractFGIDs.indexOf(fgid) !== index || existingFGIDs.includes(fgid));
    if (duplicates.length > 0) {
      throw new BadRequestException(`Duplicate contractFGID(s) found: ${duplicates.join(', ')}`);
    }

    const newContracts = await this.contractModel.insertMany(bulkCreateContractDto.contracts);
    return newContracts.map(contract => contract.toObject() as IContract);
  }

  async updateContractByFGID(
    contractFGID: string,
    updateContractDto: UpdateContractDto,
  ): Promise<IContract> {
    const existingContract = await this.contractModel.findOneAndUpdate(
      { contractFGID },
      updateContractDto,
      { new: true },
    );
    if (!existingContract) {
      throw new NotFoundException(
        `Contract with FGID #${contractFGID} not found`,
      );
    }
    return existingContract;
  }

  async getAllContracts(): Promise<IContract[]> {
    const contractData = await this.contractModel.find().lean();
    if (!contractData || contractData.length == 0) {
      throw new NotFoundException('Contracts data not found!');
    }
    return contractData.map((contract) => this.processContract(contract));
  }

  async getContract(contractId: string): Promise<IContract> {
    const existingContract = await this.contractModel
      .findById(contractId)
      .lean()
      .exec();
    if (!existingContract) {
      throw new NotFoundException(`Contract #${contractId} not found`);
    }
    return this.processContract(existingContract);
  }

  async deleteContract(contractId: string): Promise<IContract> {
    const deletedContract =
      await this.contractModel.findByIdAndDelete(contractId);
    if (!deletedContract) {
      throw new NotFoundException(`Contract #${contractId} not found`);
    }
    return deletedContract;
  }

  private processContract(contract: any): any {
    contract.milestoneAmount = contract.milestoneAmount.sort((a, b) => {
      if (a.year === b.year) {
        return a.revision - b.revision;
      }
      return a.year - b.year;
    });

    contract.milestoneAmount.forEach((milestone: any) => {
      delete milestone._id;
      delete milestone.month._id;
    });

    return contract;
  }
}