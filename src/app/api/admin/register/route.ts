import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    await connectDB();

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Un administrateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Créer le nouvel admin
    const admin = await Admin.create({
      name,
      email,
      password,
    });

    // Générer le token JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'votre_secret_jwt',
      { expiresIn: '1d' }
    );

    return NextResponse.json(
      {
        message: 'Administrateur créé avec succès',
        token,
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