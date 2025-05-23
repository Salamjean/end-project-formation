import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Parking from '@/models/Parking';

// GET /api/parkings - Récupérer tous les parkings
export async function GET() {
  try {
    await connectDB();
    const parkings = await Parking.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(parkings);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// POST /api/parkings - Créer un nouveau parking
export async function POST(req: Request) {
  try {
    const {
      name,
      address,
      totalSpots,
      pricePerHour,
      description,
      images,
    } = await req.json();

    await connectDB();

    // Vérifier si un parking avec le même nom existe déjà
    const existingParking = await Parking.findOne({ name });
    if (existingParking) {
      return NextResponse.json(
        { message: 'Un parking avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    // Créer le nouveau parking avec availableSpots initialisé
    const parking = await Parking.create({
      name,
      address,
      totalSpots,
      availableSpots: totalSpots, // Initialiser avec le nombre total de places
      pricePerHour,
      description,
      images,
    });

    return NextResponse.json(
      {
        message: 'Parking créé avec succès',
        parking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 