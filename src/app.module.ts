import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractSchema } from './schema/contract.schema';
import { ContractManagementService } from './contractManagement/contractManagement.service';
import { ContractManagementController } from './contractManagement/contractManagement.controller';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/defaultdb',
    ),
    MongooseModule.forFeature([{ name: 'Contract', schema: ContractSchema }]),
  ],
  controllers: [AppController, ContractManagementController],
  providers: [AppService, ContractManagementService],
})
export class AppModule {}