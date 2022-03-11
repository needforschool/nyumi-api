/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticationError, UserInputError } from "apollo-server-core";
import User from "../../models/User";
import {
  validateRegisterInput,
  validateLoginInput,
  validateChangePasswordInput,
} from "../../utils/validators";
import checkAuth from "../../utils/checkAuth";
import { MAIL_USER, transporter } from "../../services/nodemailer";
import APP from "../../constants/app";
import Log from "../../utils/log";
import HTML_CHANGE_PASSWORD from "../../services/nodemailer/models/changePassword";
import MESSAGES from "../../constants/messages";

const SECRET_KEY = process.env.SECRET_KEY || "secretKey";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    SECRET_KEY,
    { expiresIn: "365d" }
  );
};

export const _getUser = async (userId: string): Promise<any> => {
  try {
    const user = await User.findById(userId);
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  Query: {
    async getCurrentUser(_, __, context: any) {
      try {
        const user = checkAuth(context);
        // get current user with user id from context
        const currentUser = await _getUser(user.id);
        return currentUser;
      } catch (err) {
        Log.error(err);
        return null;
      }
    },
  },
  Mutation: {
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ email });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.incorrectCredentials = MESSAGES.ERROR_AUTH_CREDENTIALS;
        throw new UserInputError(MESSAGES.ERROR_AUTH_CREDENTIALS, { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(_, { registerInput: { email, password, firstname } }) {
      // validate user data
      const { valid, errors } = validateRegisterInput(email, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // make sure user doesnt already exist
      const user = await User.findOne({ email });
      if (user) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "This email is taken",
          },
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const goals = {
        step: 0,
        smoke: 0,
      };

      const newUser = new User({
        email,
        password,
        firstname,
        goals,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async updateUser(
      _: any,
      {
        firstname,
      }: {
        firstname: string;
      },
      context: any
    ): Promise<any> {
      const user = checkAuth(context);

      if (!user) throw new AuthenticationError("Action not allowed");

      const token = generateToken(user);

      try {
        await User.updateOne({ _id: user.id }, { firstname });

        const res = await _getUser(user.id);

        return {
          ...res._doc,
          id: res._id,
          token,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    async recoverUser(_, { email }) {
      let success = false;
      const recoverCode = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);

      const user = await User.findOne({ email });
      if (user) {
        user.recover = {
          code: recoverCode,
          createdAt: new Date().toISOString(),
        };
        await user.save();
        // send mail to "email"
        try {
          const info = await transporter.sendMail({
            from: `"${APP.NAME}" <${MAIL_USER}>`, // sender address
            to: email,
            subject: `Change Password | ${APP.NAME}`, // Subject line
            text: `Dont see this mail correctly? your code is: ${recoverCode}`, // plain text body
            html: HTML_CHANGE_PASSWORD(recoverCode), // html body
          });
          Log.info(`message sent: ${info.messageId}`);
          success = true;
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new Error(MESSAGES.ERROR_NOT_FOUND("user"));
      }
      return {
        success,
      };
    },
    async updateUserPassword(_, { email, code, password, confirmPassword }) {
      const { valid, errors } = validateChangePasswordInput(
        email,
        code,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ email });
      if (user) {
        if (user.recover) {
          if (user.recover.code === code) {
            const now = new Date();
            const createdAt = new Date(user.recover.createdAt);
            const ONE_HOUR = 1000 * 60 * 60;
            if (now.valueOf() - createdAt.valueOf() < ONE_HOUR) {
              const token = generateToken(user);
              password = await bcrypt.hash(password, 12);
              user.password = password;
              user.recover = undefined;
              const res = await user.save();
              return {
                ...res._doc,
                id: res._id,
                token,
              };
              // send mail to "email" to say its confirmed
            } else {
              throw new Error("Token expired");
            }
          } else {
            throw new Error("Token is invalid");
          }
        } else {
          throw new Error("User doesn't have token");
        }
      } else {
        throw new Error("User not found");
      }
    },
  },
};
