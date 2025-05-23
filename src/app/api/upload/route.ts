import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Aucun fichier n\'a été fourni' },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');

    // Créer le dossier uploads s'il n'existe pas
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        continue;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Le fichier doit être une image' },
          { status: 400 }
        );
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Le fichier ne doit pas dépasser 5MB' },
          { status: 400 }
        );
      }

      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Générer un nom de fichier unique
        const uniqueId = uuidv4();
        const extension = file.name.split('.').pop();
        const fileName = `${uniqueId}.${extension}`;
        const filePath = join(uploadDir, fileName);

        // Écrire le fichier
        await writeFile(filePath, buffer);

        // Ajouter l'URL à la liste
        urls.push(`/uploads/${fileName}`);
      } catch (writeError) {
        console.error('Erreur lors de l\'écriture du fichier:', writeError);
        return NextResponse.json(
          { error: 'Erreur lors de l\'enregistrement du fichier' },
          { status: 500 }
        );
      }
    }

    if (urls.length === 0) {
      return NextResponse.json(
        { error: 'Aucun fichier n\'a pu être uploadé' },
        { status: 400 }
      );
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'upload' },
      { status: 500 }
    );
  }
} 