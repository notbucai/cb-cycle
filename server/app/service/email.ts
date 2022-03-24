import { Service } from 'egg';
import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import { SEND_CODE_TEMPLATE } from '../core/template';

/**
 * Test Service
 */
export default class Email extends Service {
  private emailHandle: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  send (mailOptions: Mail.Options) {
    if (!this.emailHandle) {
      const config = this.config.email;
      this.emailHandle = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: config.auth.user,
          pass: config.auth.pass,
        },
      });
    }
    return this.emailHandle.sendMail(mailOptions);
  }

  sendCode (to: string, code: string) {
    const website = this.config.website;
    const email = this.config.email;
    return this.send({
      from: `${website.title} <${email.auth.user}>`,
      to,
      subject: '【不才的博客】操作验证码',
      html: SEND_CODE_TEMPLATE.replace('<%--code--%>', code)
    });
  }
}

