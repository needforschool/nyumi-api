import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User } from "@interfaces/user.interface";
import { CreateUserDto } from "@interfaces/dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async searchUser(params?: { email?: string }): Promise<User[]> {
    return this.userModel.find(params || {}).exec();
  }

  async compareUserPassword(user: User, password: string): Promise<boolean> {
    return user.compareEncryptedPassword(password);
  }

  async searchUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUserById(
    id: string,
    userParams: { is_confirmed: boolean }
  ): Promise<User | null> {
    return this.userModel.findOneAndUpdate({ _id: id }, userParams).exec();
  }

  async createUser(payload: CreateUserDto): Promise<User> {
    const userModel = new this.userModel(payload);
    return await userModel.save();
  }
}
