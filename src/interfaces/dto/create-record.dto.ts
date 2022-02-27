import { IsNumber, IsPositive } from "class-validator";

export class CreateRecordDto {
  @IsNumber()
  @IsPositive()
  value: number;
}
