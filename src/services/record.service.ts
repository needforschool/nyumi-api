import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Record } from "@interfaces/record.interface";
import { RecordType } from "@enums/record-type.enum";
import { CreateRecordDto } from "@dto/create-record.dto";

@Injectable()
export class RecordService {
  constructor(
    @InjectModel("CigarettesRecords")
    private readonly cigaretteRecordModel: Model<Record>,
    @InjectModel("StepsRecords")
    private readonly stepsRecordModel: Model<Record>
  ) {}

  async searchAllRecords(params?: {
    type?: RecordType;
    userId?: string;
  }): Promise<Record[]> {
    return [
      ...(await this.cigaretteRecordModel.find().exec()),
      ...(await this.stepsRecordModel.find().exec()),
    ];
  }

  async createCigaretteRecord(
    payload: CreateRecordDto,
    userId: string
  ): Promise<Record> {
    const record: Record = new this.cigaretteRecordModel({
      ...payload,
      user_id: userId,
      type: RecordType.CIGARETTES,
    });
    return record.save();
  }

  async createStepRecord(
    payload: CreateRecordDto,
    userId: string
  ): Promise<Record> {
    const record: Record = new this.stepsRecordModel({
      ...payload,
      user_id: userId,
      type: RecordType.STEPS,
    });
    return record.save();
  }
}
