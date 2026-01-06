const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function enviarEmail({ nome, email, assunto, mensagem }) {
  const mailOptions = {
    from: `"Site do Templo" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `[Contato] ${assunto}`,
    text: `
Nova mensagem recebida pelo site

Nome: ${nome}
E-mail: ${email}
Assunto: ${assunto}

Mensagem:
${mensagem}
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = enviarEmail;