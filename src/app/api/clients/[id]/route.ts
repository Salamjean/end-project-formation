import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Client from '@/models/Client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const client = await Client.findById(params.id);
    if (!client) {
      return NextResponse.json(
        { message: 'Client non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Une erreur est survenue' },
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
    const { name, email, phone, address } = body;

    const client = await Client.findById(params.id);
    if (!client) {
      return NextResponse.json(
        { message: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre client
    if (email !== client.email) {
      const existingClient = await Client.findOne({ email });
      if (existingClient) {
        return NextResponse.json(
          { message: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour les champs
    client.name = name;
    client.email = email;
    client.phone = phone;
    client.address = address;

    await client.save();

    return NextResponse.json(client);
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

    const client = await Client.findById(params.id);
    if (!client) {
      return NextResponse.json(
        { message: 'Client non trouvé' },
        { status: 404 }
      );
    }

    await client.deleteOne();

    return NextResponse.json({ message: 'Client supprimé avec succès' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 