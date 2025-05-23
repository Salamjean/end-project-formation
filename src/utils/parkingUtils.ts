import Parking from '@/models/Parking';
import mongoose from 'mongoose';

export async function updateParkingSpots(parkingId: string, increment: boolean = false) {
  try {
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      throw new Error('Parking non trouvé');
    }

    // Si increment est true, on ajoute une place (sortie du client)
    // Si increment est false, on retire une place (entrée du client)
    const newAvailableSpots = increment 
      ? Math.min(parking.availableSpots + 1, parking.totalSpots)
      : Math.max(parking.availableSpots - 1, 0);

    // Vérifier si le parking a des places disponibles
    if (!increment && newAvailableSpots === 0) {
      throw new Error('Aucune place disponible dans ce parking');
    }

    parking.availableSpots = newAvailableSpots;
    await parking.save();

    return parking;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des places:', error);
    throw error;
  }
}

export async function checkParkingAvailability(parkingId: string) {
  try {
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      throw new Error('Parking non trouvé');
    }

    return {
      available: parking.availableSpots > 0,
      availableSpots: parking.availableSpots,
      totalSpots: parking.totalSpots
    };
  } catch (error) {
    console.error('Erreur lors de la vérification des places:', error);
    throw error;
  }
} 