import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ReservationConfirmationPage({ params }: PageProps) {
  await connectDB();
  
  const reservation = await Reservation.findById(params.id)
    .populate('parkingId', 'name address');

  if (!reservation) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Réservation Confirmée
        </h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Détails de la réservation</h2>
            <p><strong>Parking:</strong> {reservation.parkingId.name}</p>
            <p><strong>Adresse:</strong> {reservation.parkingId.address}</p>
            <p><strong>Date de début:</strong> {new Date(reservation.startDate).toLocaleString()}</p>
            <p><strong>Date de fin:</strong> {new Date(reservation.endDate).toLocaleString()}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Informations client</h2>
            <p><strong>Nom:</strong> {reservation.clientName}</p>
            <p><strong>Email:</strong> {reservation.clientEmail}</p>
            <p><strong>Téléphone:</strong> {reservation.clientPhone}</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-green-600 font-semibold">
              Votre réservation a été enregistrée avec succès !
            </p>
            <p className="text-gray-600 mt-2">
              Un email de confirmation a été envoyé à votre adresse email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 