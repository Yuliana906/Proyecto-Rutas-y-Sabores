// Archivo: src/config/mailer.js

// Configuración simulada para envíos de correo SMTP (Nodemailer)
const mailerConfig = {
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || 'usuario_demo',
    pass: process.env.SMTP_PASS || 'password_demo'
  }
};

const sendEmailNotification = async (to, subject, body) => {
  console.log(`[MAILER DEMO] Enviando correo a: ${to} | Asunto: ${subject}`);
  return true;
};

module.exports = { mailerConfig, sendEmailNotification };