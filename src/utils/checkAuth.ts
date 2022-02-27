import { AuthenticationError } from "apollo-server-core";
import jwt from "jsonwebtoken";
import dotenv from "dotenv-flow";
import MESSAGES from "../constants/messages";

dotenv.config({
  silent: true,
});

const SECRET_KEY = process.env.SECRET_KEY || "secretKey";

const checkAuth = (context: any) => {
  const authHeader = context.request.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Mskn ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError(MESSAGES.ERROR_AUTH_TOKEN_INVALID);
      }
    }
    throw new Error(MESSAGES.ERROR_AUTH_TOKEN);
  }
  throw new Error(MESSAGES.ERROR_AUTH_HEADER);
};

export default checkAuth;
