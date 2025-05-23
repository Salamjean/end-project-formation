import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import Parking from '@/models/Parking';
import { updateParkingSpots, checkParkingAvailability } from '@/utils/parkingUtils';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Récupérer le paramètre de statut de l'URL
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Construire la requête en fonction du statut
    let query = {};
    if (status) {
      query = { status };
    }

    const reservations = await Reservation.find(query)
      .populate('parkingId', 'name address')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { parkingId, startDate, endDate, ...reservationData } = body;

    // Vérifier si le parkingId est fourni
    if (!parkingId) {
      return NextResponse.json(
        { message: 'L\'ID du parking est requis' },
        { status: 400 }
      );
    }

    // Vérifier si le parking existe
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return NextResponse.json(
        { message: 'Parking non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier la disponibilité du parking
    const availability = await checkParkingAvailability(parkingId);
    if (!availability.available) {
      return NextResponse.json(
        { message: 'Aucune place disponible dans ce parking' },
        { status: 400 }
      );
    }

    // Vérifier les dates
    if (!startDate || !endDate) {
      return NextResponse.json(
        { message: 'Les dates de début et de fin sont requises' },
        { status: 400 }
      );
    }

    // Créer la réservation
    const reservation = new Reservation({
      ...reservationData,
      parkingId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'pending'
    });

    await reservation.save();

    // Récupérer la réservation complète avec son ID
    const savedReservation = await Reservation.findById(reservation._id)
      .populate('parkingId', 'name address');

    return NextResponse.json(
      { 
        message: 'Réservation créée avec succès', 
        reservation: savedReservation 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur lors de la création de la réservation:', error);
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la création de la réservation' },
      { status: 500 }
    );
  }
}

// API pour confirmer une réservation
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { reservationId, status } = body;

    if (!reservationId) {
      return NextResponse.json(
        { message: 'L\'ID de la réservation est requis' },
        { status: 400 }
      );
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return NextResponse.json(
        { message: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Si la réservation est confirmée, mettre à jour les places disponibles
    if (status === 'confirmed' && reservation.status === 'pending') {
      await updateParkingSpots(reservation.parkingId.toString());
    }
    // Si la réservation est annulée et était confirmée, libérer une place
    else if (status === 'cancelled' && reservation.status === 'confirmed') {
      await updateParkingSpots(reservation.parkingId.toString(), true);
    }

    reservation.status = status;
    await reservation.save();

    return NextResponse.json(
      { message: 'Réservation mise à jour avec succès', reservation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    );
  }
} 