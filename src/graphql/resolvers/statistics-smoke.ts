import { AuthenticationError } from "apollo-server-core";
import StatisticSmoke from "../../models/StatisticSmoke";
import checkAuth from "../../utils/checkAuth";
import Log from "../../utils/log";
import { _getUser } from "./users";

export const _getAllSmoke = async (userId: string): Promise<Array<any>> => {
  try {
    const smokes = await StatisticSmoke.find({ user: userId });
    if (smokes) {
      return smokes;
    } else {
      throw new Error("Statistics not found");
    }
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  Query: {
    async getAllSmoke(_, __, context: any) {
      try {
        const user = checkAuth(context);
        return _getAllSmoke(user.id);
      } catch (err) {
        Log.error(err);
        return null;
      }
    },
  },
  Mutation: {
    async addSmoke(_, __, context: any): Promise<any> {
      const user = checkAuth(context);
      if (!user) throw new AuthenticationError("Action not allowed");

      const newSmoke = new StatisticSmoke({
        user: user.id,
        createdAt: new Date().toISOString(),
      });
      await newSmoke.save();

      const result = await _getAllSmoke(user.id);

      return result.length;
    },
  },
};
