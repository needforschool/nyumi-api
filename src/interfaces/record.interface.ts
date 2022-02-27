import { Document } from "mongoose";

export interface Record extends Document {
  user_id: string;
  type: string;
  value: number;
  date: Date;
}
