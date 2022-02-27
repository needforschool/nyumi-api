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
import ROLES, { roleType } from "../../data/roles";
import { _getRole } from "./roles";
import crypto from "crypto";
import { MAIL_USER, transporter } from "../../services/nodemailer";
import { APP_NAME, APP_URL } from "../../constants/main";
import Log from "../../utils/log";
import HTML_CHANGE_PASSWORD from "../../services/nodemailer/models/changePassword";
import HTML_WELCOME from "../../services/nodemailer/models/welcome";
import { Success } from "../../types/success";
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
      const roles = user.roles.map((roleId) => {
        const role = ROLES.filter((role) => role.id === roleId)[0];
        return role;
      });
      const authentic = user.authentic.status ?? false;

      return { ...user._doc, id: user._id, roles, authentic };
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  Query: {
    async getUsers(_: any, __: any, context: any): Promise<any> {
      // we need to check if the user is authenticated and if he has the role admin
      const user = checkAuth(context);
      const currentUser = await User.findById(user.id);
      if (currentUser.roles.includes(roleType.admin)) {
        // find all the users
        const users = await User.find();
        // return formatted users like "_getUser"
        return users.map((user) => {
          const roles = user.roles.map((roleId) => {
            const role = ROLES.filter((role) => role.id === roleId)[0];
            return role;
          });
          const authentic = user.authentic.status ?? false;
          return { ...user._doc, id: user._id, roles, authentic };
        });
      } else {
        throw new AuthenticationError(MESSAGES.ERROR_AUTH_NOT_ALLOWED);
      }
    },
    async getUserEmail(
      _,
      { email }: { email: string }
    ): Promise<{
      success: boolean;
    }> {
      let success = false;
      // get user by email to see if it exists
      const user = await User.findOne({ email });
      if (user) success = true;
      return { success };
    },
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

      const roles = user.roles.map((roleId) => {
        return _getRole(roleId);
      });

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
        roles,
      };
    },
    async register(
      _,
      {
        registerInput: {
          email,
          password,
          firstname,
          lastname,
          tel,
          streetNumber,
          streetName,
          zipCode,
          city,
        },
      }
    ) {
      // validate user data
      const { valid, errors } = validateRegisterInput(email, tel, password);
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

      // set user roles to customer only
      const roles = [roleType.customer];

      // set authentic user token to confirm email
      const authenticToken = crypto.randomBytes(64).toString("hex");
      const authentic = {
        token: authenticToken,
        status: false,
      };

      const newUser = new User({
        email,
        password,
        roles,
        firstname,
        lastname,
        tel,
        streetNumber,
        streetName,
        zipCode,
        city,
        authentic,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const link = `${APP_URL}/dashboard?verify=${authentic.token}`;
      try {
        const info = await transporter.sendMail({
          from: `"${APP_NAME}" <${MAIL_USER}>`, // sender address
          to: res.email,
          subject: `Verify your email | ${APP_NAME}`, // Subject line
          text: `Dont see this mail correctly? click this link: ${link}`, // plain text body
          html: HTML_WELCOME(link), // html body
        });
        Log.info(`message sent: ${info.messageId}`);
      } catch (err) {
        throw new Error(err);
      }

      const userRoles = roles.map((roleId) => {
        const role = ROLES.filter((role) => role.id === roleId)[0];
        return role;
      });

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
        roles: userRoles,
      };
    },
    async updateUser(
      _: any,
      {
        firstname,
        lastname,
        tel,
        streetNumber,
        streetName,
        zipCode,
        city,
      }: {
        firstname: string;
        lastname: string;
        tel: string;
        streetNumber: string;
        streetName: string;
        zipCode: string;
        city: string;
      },
      context: any
    ): Promise<any> {
      const user = checkAuth(context);

      if (!user) throw new AuthenticationError("Action not allowed");

      const token = generateToken(user);

      try {
        await User.updateOne(
          { _id: user.id },
          { firstname, lastname, tel, streetNumber, streetName, zipCode, city }
        );

        const res = await _getUser(user.id);

        return {
          ...res,
          token,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    async sendVerification(_, __, context): Promise<Success> {
      const authUser = checkAuth(context);
      const authentic = {
        token: crypto.randomBytes(64).toString("hex"),
      };

      if (authUser) {
        const user = await User.findById(authUser.id);
        if (user && !user.authentic.status) {
          user.authentic = {
            ...user.authentic,
            ...authentic,
          };
          await user.save();
          // send mail to "email"
          const link = `${APP_URL}/dashboard?verify=${authentic.token}`;
          try {
            const info = await transporter.sendMail({
              from: `"${APP_NAME}" <${MAIL_USER}>`, // sender address
              to: user.email,
              subject: `Verify your email | ${APP_NAME}`, // Subject line
              text: `Dont see this mail correctly? click this link: ${link}`, // plain text body
              html: HTML_WELCOME(link), // html body
            });
            Log.info(`message sent: ${info.messageId}`);
            return { success: true };
          } catch (err) {
            throw new Error(err);
          }
        } else {
          throw new Error("User not found");
        }
      }
      return { success: false };
    },
    async recoverUser(_, { email }) {
      let success = false;
      const recoverToken = crypto.randomBytes(64).toString("hex");

      const user = await User.findOne({ email });
      if (user) {
        user.recover = {
          token: recoverToken,
          createdAt: new Date().toISOString(),
        };
        await user.save();
        // send mail to "email"
        const link = `${APP_URL}/auth/recovery/change?email=${email}&token=${recoverToken}`;
        try {
          const info = await transporter.sendMail({
            from: `"${APP_NAME}" <${MAIL_USER}>`, // sender address
            to: email,
            subject: `Change Password | ${APP_NAME}`, // Subject line
            text: `Dont see this mail correctly? click this link: ${link}`, // plain text body
            html: HTML_CHANGE_PASSWORD(link), // html body
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
    async verifyUser(_, { token }, context) {
      let success = false;
      const authUser = checkAuth(context);

      if (authUser) {
        const user = await User.findById(authUser.id);
        if (user && !user.authentic.status) {
          if (user.authentic.token === token) {
            user.authentic = {
              status: true,
            };
            await user.save();
            success = true;
          }
        }
      }

      return {
        success,
      };
    },
    async updateUserPassword(_, { email, token, password, confirmPassword }) {
      const { valid, errors } = validateChangePasswordInput(
        email,
        token,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ email });
      if (user) {
        if (user.recover) {
          if (user.recover.token === token) {
            const now = new Date();
            const createdAt = new Date(user.recover.createdAt);
            const ONE_HOUR = 1000 * 60 * 60;
            if (now.valueOf() - createdAt.valueOf() < ONE_HOUR) {
              const token = generateToken(user);
              password = await bcrypt.hash(password, 12);
              user.password = password;
              user.recover = undefined;
              const res = await user.save();
              const roles = res.roles.map((roleId) => {
                return _getRole(roleId);
              });
              return {
                ...res._doc,
                id: res._id,
                token,
                roles,
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
