import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'L\'adresse est requise'],
    trim: true,
  },
  // Informations de la voiture
  carBrand: {
    type: String,
    required: [true, 'La marque de la voiture est requise'],
    trim: true,
  },
  carModel: {
    type: String,
    required: [true, 'Le modèle de la voiture est requis'],
    trim: true,
  },
  carColor: {
    type: String,
    required: [true, 'La couleur de la voiture est requise'],
    trim: true,
  },
  carLicensePlate: {
    type: String,
    required: [true, 'La plaque d\'immatriculation est requise'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: [true, 'Le parking est requis'],
  },
  
  entryTime: {
    type: Date,
    required: [true, 'L\'heure d\'entrée est requise'],
  },
  exitTime: {
    type: Date,
    required: [true, 'L\'heure de sortie est requise'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true // Active automatiquement createdAt et updatedAt
});

// Mettre à jour le champ updatedAt avant chaque sauvegarde
clientSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

export default Client; 