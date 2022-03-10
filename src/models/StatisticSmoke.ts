import { model, Schema } from "mongoose";

const StatisticSmokeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: String,
});

export default model("StatisticSmoke", StatisticSmokeSchema);
