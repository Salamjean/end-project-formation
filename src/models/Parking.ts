import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du parking est requis'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "L'adresse du parking est requise"],
      trim: true,
    },
    totalSpots: {
      type: Number,
      required: [true, 'Le nombre total de places est requis'],
      min: [1, 'Le nombre de places doit être supérieur à 0'],
    },
    availableSpots: {
      type: Number,
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Le prix par heure est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [{
      type: String,
      trim: true,
    }],
    services: [{
      type: String,
      trim: true,
    }],
    openingHours: {
      type: String,
      default: '24h/24, 7j/7'
    }
  },
  {
    timestamps: true,
  }
);

// Mettre à jour le nombre de places disponibles avant la sauvegarde
parkingSchema.pre('save', function(next) {
  if (this.isNew) {
    this.availableSpots = this.totalSpots;
  }
  next();
});

const Parking = mongoose.models.Parking || mongoose.model('Parking', parkingSchema);

export default Parking; 