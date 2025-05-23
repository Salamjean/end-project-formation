import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import Parking from '@/models/Parking';

export async function GET() {
  try {
    await connectDB();

    // Compter le nombre total de réservations
    const totalReservations = await Reservation.countDocuments();

    // Compter le nombre de réservations confirmées
    const confirmedReservations = await Reservation.countDocuments({ status: 'confirmed' });

    // Compter le nombre de réservations en attente
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });

    // Compter le nombre de réservations annulées
    const cancelledReservations = await Reservation.countDocuments({ status: 'cancelled' });

    // Compter le nombre total de parkings
    const totalParkings = await Parking.countDocuments();

    // Calculer le nombre total de places et places disponibles
    const parkings = await Parking.find({}, 'totalSpots availableSpots');
    const totalSpots = parkings.reduce((acc, parking) => acc + parking.totalSpots, 0);
    const totalAvailableSpots = parkings.reduce((acc, parking) => acc + parking.availableSpots, 0);

    return NextResponse.json({
      totalReservations,
      confirmedReservations,
      pendingReservations,
      cancelledReservations,
      totalParkings,
      totalSpots,
      totalAvailableSpots
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 