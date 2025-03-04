import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContractDto } from 'src/dto/create-contract.dto';
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
    const newContract = new this.contractModel(createContractDto);
    return newContract.save();
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
    const contractData = await this.contractModel.find();
    if (!contractData || contractData.length == 0) {
      throw new NotFoundException('Contracts data not found!');
    }
    return contractData;
  }

  async getContract(contractId: string): Promise<IContract> {
    const existingContract = await this.contractModel
      .findById(contractId)
      .exec();
    if (!existingContract) {
      throw new NotFoundException(`Contract #${contractId} not found`);
    }
    return existingContract;
  }

  async deleteContract(contractId: string): Promise<IContract> {
    const deletedContract =
      await this.contractModel.findByIdAndDelete(contractId);
    if (!deletedContract) {
      throw new NotFoundException(`Contract #${contractId} not found`);
    }
    return deletedContract;
  }
}
