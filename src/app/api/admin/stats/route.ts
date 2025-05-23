import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Parking from '@/models/Parking';
import Client from '@/models/Client';

export async function GET() {
  try {
    await connectDB();

    // Récupérer le nombre total de parkings
    const totalParkings = await Parking.countDocuments();

    // Récupérer le nombre total de clients
    const totalClients = await Client.countDocuments();

    // Pour l'instant, nous utilisons des valeurs fictives pour les réservations
    // TODO: Implémenter le modèle de réservation
    const totalReservations = 0;
    const activeReservations = 0;

    return NextResponse.json({
      totalParkings,
      totalClients,
      totalReservations,
      activeReservations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 