import { IsNumber, IsPositive } from "class-validator";

export class CreateRecordDto {
  @IsPositive()
  value: number;
}
