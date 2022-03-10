import usersResolvers from "./users";
import statisticSmokeResolvers from "./statistics-smoke";
import statisticWalkResolvers from "./statistics-walk";

export default {
  Query: {
    ...usersResolvers.Query,
    ...statisticSmokeResolvers.Query,
    ...statisticWalkResolvers.Query,
  },
  Mutation: {
    ...statisticSmokeResolvers.Mutation,
    ...statisticWalkResolvers.Mutation,
  },
};
