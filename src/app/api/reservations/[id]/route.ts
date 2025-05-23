import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import Parking from '@/models/Parking';
import { sendReservationEmail } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const reservation = await Reservation.findById(params.id)
      .populate('parkingId', 'name address');

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la réservation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { status } = body;

    if (!['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    const reservation = await Reservation.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    ).populate('parkingId', 'name');

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Si la réservation est annulée, remettre la place à disposition
    if (status === 'cancelled') {
      await Parking.findByIdAndUpdate(reservation.parkingId, {
        $inc: { availableSpots: 1 }
      });
    }

    // Envoyer un email au client
    try {
      await sendReservationEmail(
        reservation.clientEmail,
        reservation.clientName,
        reservation.parkingId.name,
        reservation.startDate,
        reservation.endDate,
        status as 'confirmed' | 'cancelled'
      );
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // On continue même si l'envoi d'email échoue
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const reservation = await Reservation.findByIdAndDelete(params.id);

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Libérer la place si la réservation n'est pas déjà annulée
    if (reservation.status !== 'cancelled') {
      await Parking.findByIdAndUpdate(reservation.parkingId, {
        $inc: { availableSpots: 1 },
      });
    }

    return NextResponse.json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la réservation' },
      { status: 500 }
    );
  }
} 