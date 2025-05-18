import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();
//ユーザー登録時にメール送信
const transporter = nodemailer.createTransport(
  {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_USER_PASSWORD
    },
    tls: {
      rejectUnauthorized: false // このオプションを追加
    }
  }
)
export default transporter;

