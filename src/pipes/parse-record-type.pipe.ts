import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";

import { RecordType } from "@enums/record-type.enum";

@Injectable()
export class ValidateRecordTypePipe implements PipeTransform<RecordType> {
  transform(value: RecordType, metadata: ArgumentMetadata) {
    if (metadata.type !== "param") return value;

    if (!(value.toUpperCase() in RecordType)) {
      throw new BadRequestException("Invalid record type.");
    }
    return value;
  }
}
