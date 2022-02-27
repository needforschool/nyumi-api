import { Module } from "@nestjs/common";

import { RecordsController } from "@controllers/records.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoConfigService } from "@services/config/mongo-config.service";
import { RecordSchema } from "@schemas/record.schema";
import { RecordService } from "@services/record.service";

@Module({
  controllers: [RecordsController],
  exports: [],
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
      connectionName: "records",
    }),
    MongooseModule.forFeature(
      [
        {
          name: "CigarettesRecords",
          schema: RecordSchema,
          collection: "cigarettes-records",
        },
      ],
      "records"
    ),

    MongooseModule.forFeature(
      [
        {
          name: "StepsRecords",
          schema: RecordSchema,
          collection: "steps-records",
        },
      ],
      "records"
    ),
  ],
  providers: [RecordService],
})
export class RecordModule {}
