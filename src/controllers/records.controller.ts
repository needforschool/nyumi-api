import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
} from "@nestjs/common";

import { Authorized } from "@decorators/authorized.decorator";
import { Role } from "@enums/role.enum";
import { ValidateRecordTypePipe } from "@pipes/parse-record-type.pipe";
import { Record } from "@interfaces/record.interface";
import { RecordType } from "@enums/record-type.enum";
import { RecordService } from "@services/record.service";
import { CreateRecordDto } from "@dto/create-record.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Records")
@Controller("records")
export class RecordsController {
  constructor(private readonly service: RecordService) {}

  @Authorized(Role.ADMIN)
  @Get()
  async getRecords(): Promise<Record[]> {
    const records: Record[] = await this.service.searchAllRecords();

    return records;
  }

  @Authorized()
  @UsePipes(new ValidateRecordTypePipe())
  @Get(":type")
  async getRecordsByType(
    @Param("type") type: RecordType,
    @Req() request: Request & { userId: string }
  ): Promise<Record[]> {
    const records: Record[] = await this.service.searchAllRecords({
      type,
      userId: request.userId,
    });

    return records;
  }

  @Authorized()
  @UsePipes(new ValidateRecordTypePipe())
  @Post(":type")
  async createRecord(
    @Param("type") type: RecordType,
    @Body() payload: CreateRecordDto,
    @Req() request: Request & { userId: string }
  ): Promise<Record> {
    if (type === RecordType.CIGARETTES) {
      const record: Record = await this.service.createCigaretteRecord(
        payload,
        request.userId
      );
      return record;
    } else if (type === RecordType.STEPS) {
      const record: Record = await this.service.createStepRecord(
        payload,
        request.userId
      );
      return record;
    } else {
      throw new BadRequestException("Invalid record type");
    }
  }
}
