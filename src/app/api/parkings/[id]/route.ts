import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Parking from '@/models/Parking';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const parking = await Parking.findById(params.id);

    if (!parking) {
      return NextResponse.json(
        { error: 'Parking non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(parking);
  } catch (error) {
    console.error('Erreur lors de la récupération du parking:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du parking' },
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
    const { name, address, totalSpots, pricePerHour, description, images } = body;

    const parking = await Parking.findById(params.id);
    if (!parking) {
      return NextResponse.json(
        { message: 'Parking non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour les champs
    parking.name = name;
    parking.address = address;
    parking.totalSpots = totalSpots;
    parking.pricePerHour = pricePerHour;
    parking.description = description;
    if (images) {
      parking.images = images;
    }

    // Mettre à jour le nombre de places disponibles si le nombre total de places a changé
    if (totalSpots !== parking.totalSpots) {
      const difference = totalSpots - parking.totalSpots;
      parking.availableSpots += difference;
    }

    await parking.save();

    return NextResponse.json(parking);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Une erreur est survenue' },
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

    const parking = await Parking.findById(params.id);
    if (!parking) {
      return NextResponse.json(
        { message: 'Parking non trouvé' },
        { status: 404 }
      );
    }

    await parking.deleteOne();

    return NextResponse.json({ message: 'Parking supprimé avec succès' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 