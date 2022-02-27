import { AuthenticationError } from "apollo-server-core";
import StatisticWalk from "../../models/StatisticWalk";
import checkAuth from "../../utils/checkAuth";
import Log from "../../utils/log";
import { _getUser } from "./users";

export const _getAllWalk = async (userId: string): Promise<Array<any>> => {
  try {
    const walks = await StatisticWalk.find({ user: userId });
    if (walks) {
      return walks;
    } else {
      throw new Error("Statistics not found");
    }
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  Query: {
    async getAllWalk(_, __, context: any) {
      try {
        const user = checkAuth(context);
        return _getAllWalk(user.id);
      } catch (err) {
        Log.error(err);
        return null;
      }
    },
  },
  Mutation: {
    async addWalk(
      _,
      { amount }: { amount: number },
      context: any
    ): Promise<any> {
      const user = checkAuth(context);
      if (!user) throw new AuthenticationError("Action not allowed");

      const newWalk = new StatisticWalk({
        user: user.id,
        amount,
        createdAt: new Date().toISOString(),
      });
      await newWalk.save();

      const result = await _getAllWalk(user.id);

      return result
        .map((item) => item.amount)
        .reduce((prev, curr) => prev + curr, 0);
    },
  },
};
