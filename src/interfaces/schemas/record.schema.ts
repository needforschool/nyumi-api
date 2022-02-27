import * as mongoose from "mongoose";

function transformValue(_: unknown, ret: { [key: string]: any }) {
  delete ret._id;
}

export const RecordSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, "User can not be empty"],
    },
    type: {
      type: String,
      required: [true, "Type can not be empty"],
    },
    value: {
      type: Number,
      required: [true, "Value can not be empty"],
    },
    date: {
      type: Date,
      required: [true, "Date can not be empty"],
      default: Date.now,
    },
  },
  {
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
  }
);
