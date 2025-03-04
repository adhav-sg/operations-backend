import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Month {
  @Prop()
  jan: string;

  @Prop()
  feb: string;

  @Prop()
  mar: string;

  @Prop()
  apr: string;

  @Prop()
  may: string;

  @Prop()
  jun: string;

  @Prop()
  jul: string;

  @Prop()
  aug: string;

  @Prop()
  sep: string;

  @Prop()
  oct: string;

  @Prop()
  nov: string;

  @Prop()
  dec: string;
}

@Schema()
export class MilestoneAmount {
  @Prop()
  revision: number;

  @Prop()
  year: number;

  @Prop({ type: Month })
  month: Month;
}

@Schema()
export class Contract extends Document {
  @Prop()
  bpSubPortfolio: string;

  @Prop()
  contractName: string;

  @Prop()
  contractType: string;

  @Prop()
  discountPercentage: string;

  @Prop()
  teamType: string;

  @Prop()
  contractCurrency: string;

  @Prop()
  contractFGID: string;

  @Prop()
  referencePO: string;

  @Prop()
  PORevision: string;

  @Prop()
  contractProgram: string;

  @Prop()
  contractCSG: string;

  @Prop()
  revenueType: string;

  @Prop()
  contractStartDate: string;

  @Prop()
  contractEndDate: string;

  @Prop()
  POAmountOMS: string;

  @Prop()
  POAmountFG: string;

  @Prop()
  POAmountAriba: string;

  @Prop()
  masterProjectCode: string;

  @Prop()
  masterProjectCodePM: string;

  @Prop()
  masterPU: string;

  @Prop()
  LOENumber: string;

  @Prop()
  linkedDPSNumber: string;

  @Prop()
  infosysContractType: string;

  @Prop()
  totalSoWWorkers: string;

  @Prop({ type: [MilestoneAmount] })
  milestoneAmount: MilestoneAmount[];
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
