import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  CreateContractDto,
  BulkCreateContractDto,
} from 'src/dto/create-contract.dto';
import { UpdateContractDto } from 'src/dto/update-contract.dto';
import { ContractManagementService } from './contractManagement.service';

@Controller('contract')
export class ContractManagementController {
  constructor(private readonly contractService: ContractManagementService) {}

  @Post()
  async createContract(
    @Res() response,
    @Body() createContractDto: CreateContractDto,
  ) {
    try {
      const newContract =
        await this.contractService.createContract(createContractDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Contract has been created successfully',
        newContract,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }
  @Post('/bulk-add-edit')
  async bulkAddEditContracts(
    @Res() response,
    @Body() bulkCreateContractDto: BulkCreateContractDto,
  ) {
    try {
      await this.contractService.bulkAddEditContracts(bulkCreateContractDto);
      return response.status(HttpStatus.OK).json({
        message: 'Contracts processed successfully',
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }
  @Post('/bulk')
  async bulkCreateContracts(
    @Res() response,
    @Body() bulkCreateContractDto: BulkCreateContractDto,
  ) {
    try {
      const newContracts = await this.contractService.bulkCreateContracts(
        bulkCreateContractDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'Contracts have been created successfully',
        newContracts,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  @Put('/:contractFGID')
  async updateContract(
    @Res() response,
    @Param('contractFGID') contractFGID: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    try {
      const existingContract = await this.contractService.updateContractByFGID(
        contractFGID,
        updateContractDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Contract has been successfully updated',
        existingContract,
      });
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || 'Internal server error',
        error: err.name || 'Error',
      });
    }
  }

  @Get()
  async getContracts(@Res() response) {
    try {
      const contractData = await this.contractService.getAllContracts();
      return response.status(HttpStatus.OK).json({
        message: 'All contracts data found successfully',
        contractData,
      });
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || 'Internal server error',
        error: err.name || 'Error',
      });
    }
  }

  @Get('/:id')
  async getContract(@Res() response, @Param('id') contractId: string) {
    try {
      const existingContract =
        await this.contractService.getContract(contractId);
      return response.status(HttpStatus.OK).json({
        message: 'Contract found successfully',
        existingContract,
      });
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || 'Internal server error',
        error: err.name || 'Error',
      });
    }
  }

  @Delete('/:id')
  async deleteContract(@Res() response, @Param('id') contractId: string) {
    try {
      const deletedContract =
        await this.contractService.deleteContract(contractId);
      return response.status(HttpStatus.OK).json({
        message: 'Contract deleted successfully',
        deletedContract,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
