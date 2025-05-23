import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Parking from '@/models/Parking';
import Client from '@/models/Client';

export async function GET() {
  try {
    await connectDB();

    // Récupérer les 5 derniers parkings créés
    const recentParkings = await Parking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');

    // Récupérer les 5 derniers clients créés
    const recentClients = await Client.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');

    // Combiner et trier les activités
    const activities = [
      ...recentParkings.map((parking) => ({
        id: parking._id.toString(),
        type: 'parking',
        action: `Nouveau parking ajouté: ${parking.name}`,
        timestamp: parking.createdAt,
      })),
      ...recentClients.map((client) => ({
        id: client._id.toString(),
        type: 'client',
        action: `Nouveau client inscrit: ${client.name}`,
        timestamp: client.createdAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

    return NextResponse.json(activities);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 