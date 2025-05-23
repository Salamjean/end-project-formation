import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  parkingId: mongoose.Types.ObjectId;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema({
  parkingId: {
    type: Schema.Types.ObjectId,
    ref: 'Parking',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Vérifier si le parking est disponible pour la période demandée
ReservationSchema.statics.isParkingAvailable = async function(
  parkingId: string,
  startTime: Date,
  endTime: Date
) {
  const overlappingReservations = await this.find({
    parkingId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        startDate: { $lt: endTime },
        endDate: { $gt: startTime },
      },
    ],
  });

  return overlappingReservations.length === 0;
};

// Calculer le prix total de la réservation
ReservationSchema.statics.calculateTotalPrice = async function(
  parkingId: string,
  startTime: Date,
  endTime: Date
) {
  const parking = await mongoose.model('Parking').findById(parkingId);
  if (!parking) {
    throw new Error('Parking non trouvé');
  }

  const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  return durationInHours * parking.pricePerHour;
};

export default mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema); 