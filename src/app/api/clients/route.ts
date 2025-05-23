import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Client from '@/models/Client';
import Parking from '@/models/Parking';
import { updateParkingSpots, checkParkingAvailability } from '@/utils/parkingUtils';

// GET /api/clients - Récupérer tous les clients
export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find().populate('parkingId');
    return NextResponse.json(clients);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la récupération des clients' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Créer un nouveau client
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { parkingId, ...clientData } = body;

    // Vérifier la disponibilité du parking
    const availability = await checkParkingAvailability(parkingId);
    if (!availability.available) {
      return NextResponse.json(
        { message: 'Aucune place disponible dans ce parking' },
        { status: 400 }
      );
    }

    await connectDB();

    // Vérifier si le client existe déjà
    const existingClient = await Client.findOne({ email: clientData.email });
    if (existingClient) {
      return NextResponse.json(
        { message: 'Un client avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Vérifier si le parking existe
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return NextResponse.json(
        { message: 'Le parking sélectionné n\'existe pas' },
        { status: 400 }
      );
    }

    // Vérifier si une voiture avec la même plaque d'immatriculation existe déjà
    const existingCar = await Client.findOne({ carLicensePlate: clientData.carLicensePlate });
    if (existingCar) {
      return NextResponse.json(
        { message: `Une voiture avec la plaque d'immatriculation ${clientData.carLicensePlate} existe déjà.` },
        { status: 400 }
      );
    }

    // Créer le client
    const client = new Client({
      ...clientData,
      parkingId,
    });

    // Mettre à jour le nombre de places disponibles
    await updateParkingSpots(parkingId);

    // Sauvegarder le client
    await client.save();

    return NextResponse.json(
      { message: 'Client créé avec succès', client },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur lors de la création du client:', error);
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la création du client' },
      { status: 500 }
    );
  }
} 