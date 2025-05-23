import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendReservationEmail(
  email: string,
  clientName: string,
  parkingName: string,
  startDate: Date,
  endDate: Date,
  status: 'confirmed' | 'cancelled'
) {
  const subject = status === 'confirmed' 
    ? 'Votre réservation a été confirmée'
    : 'Votre réservation a été annulée';

  const message = status === 'confirmed'
    ? `Bonjour ${clientName},\n\nVotre réservation pour le parking "${parkingName}" a été confirmée.\n\nDétails de la réservation :\n- Date de début : ${new Date(startDate).toLocaleString()}\n- Date de fin : ${new Date(endDate).toLocaleString()}\n\nNous vous souhaitons un excellent séjour !`
    : `Bonjour ${clientName},\n\nVotre réservation pour le parking "${parkingName}" a été annulée.\n\nDétails de la réservation annulée :\n- Date de début : ${new Date(startDate).toLocaleString()}\n- Date de fin : ${new Date(endDate).toLocaleString()}\n\nPour toute question, n'hésitez pas à nous contacter.`;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject,
      text: message,
    });
    console.log('Email envoyé:', info.response);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
} 