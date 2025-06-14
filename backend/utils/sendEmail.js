
const { text } = require('express');
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try{
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: `"Don Pocho Market" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ', info.response);
  } catch (error) {
      console.error('Error enviando email:', error);
      throw new Error('Error al enviar email');
    };
}

module.exports = sendEmail;