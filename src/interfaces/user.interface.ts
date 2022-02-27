import { Document } from "mongoose";

export interface User extends Document {
  id?: string;
  email: string;
  password: string;
  role: string;

  // Ghost fields
  compareEncryptedPassword?: (password: string) => boolean;
  getEncryptedPassword?: (password: string) => string;
}
