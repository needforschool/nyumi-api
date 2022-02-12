import { Document } from "mongoose";

export interface Token extends Document {
  user_id: string;
  token: string;
}
