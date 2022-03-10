import { model, Schema } from "mongoose";

const StatisticWalkSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  amount: Number,
  createdAt: String,
});

export default model("StatisticWalk", StatisticWalkSchema);
