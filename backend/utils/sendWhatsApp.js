
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsApp = aync (to, message);{
  try{
    const result = await client.messages.create({
      from: `whatsapp: ${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp: ${to}`,
      body: message
    });

    console.log('WhatsaApp enviado:', result.sid);
  } catch (error) {
    console.error('Error al enviar whatsApp:', error.message);
    throw new Error('Error al enviar WhatsApp');
  }
};

export default sendWhatsApp;

