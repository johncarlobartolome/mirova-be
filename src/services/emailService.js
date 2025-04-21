import nodemailer from "nodemailer";
import nodemailerExpressHandlebars from "nodemailer-express-handlebars";
import path from "path";
import { google } from "googleapis";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_CLIENT_ID = process.env.EMAIL_CLIENT_ID;
const EMAIL_CLIENT_SECRET = process.env.EMAIL_CLIENT_SECRET;
const EMAIL_REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: EMAIL_REFRESH_TOKEN,
});

export const sendEmail = async (to, subject, template, context) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_USER,
        clientId: EMAIL_CLIENT_ID,
        clientSecret: EMAIL_CLIENT_SECRET,
        refreshToken: EMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    transporter.use(
      "compile",
      nodemailerExpressHandlebars({
        viewEngine: {
          extname: ".hbs",
          partialsDir: path.resolve("./src/views/partials"),
          layoutsDir: path.resolve("./src/views/layouts"),
          defaultLayout: "",
        },
        viewPath: path.resolve("./src/views"),
        extName: ".hbs",
      })
    );

    const mailOptions = {
      from: "<support_mirova0421@outlook.com>",
      to,
      subject,
      template,
      context,
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};
