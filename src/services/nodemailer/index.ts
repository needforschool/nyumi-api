/* eslint-disable @typescript-eslint/no-var-requires */
import nodemailer from "nodemailer";
import dotenv from "dotenv-flow";

dotenv.config({
  silent: true,
});

const MAIL_HOST = process.env.MAIL_HOST || "";
export const MAIL_USER = process.env.MAIL_USER || "";
const MAIL_PASS = process.env.MAIL_PASS || "";

export const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});
