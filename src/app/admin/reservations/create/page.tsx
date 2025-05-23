'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface Parking {
  _id: string;
  name: string;
  address: string;
  pricePerHour: number;
  availableSpots: number;
}

interface Client {
  _id: string;
  name: string;
  email: string;
}

export default function CreateReservation() {
  const router = useRouter();
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    parkingId: '',
    clientId: '',
    startTime: '',
    endTime: '',
  });
  const [reservationDetails, setReservationDetails] = useState<any>(null);

  useEffect(() => {
    fetchParkingsAndClients();
  }, []);

  const fetchParkingsAndClients = async () => {
    try {
      const [parkingsRes, clientsRes] = await Promise.all([
        fetch('/api/parkings'),
        fetch('/api/clients'),
      ]);

      if (!parkingsRes.ok || !clientsRes.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const [parkingsData, clientsData] = await Promise.all([
        parkingsRes.json(),
        clientsRes.json(),
      ]);

      setParkings(parkingsData);
      setClients(clientsData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la réservation');
      }

      const data = await response.json();
      setReservationDetails(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handlePrint = () => {
    const selectedParking = parkings.find(p => p._id === formData.parkingId);
    const selectedClient = clients.find(c => c._id === formData.clientId);
    
    // Créer un élément temporaire pour le reçu
    const receiptElement = document.createElement('div');
    receiptElement.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a56db; margin-bottom: 10px;">Reçu de réservation</h1>
          <p style="color: #6b7280;">Date: ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        <div style="margin-bottom: 20px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #111827; margin-bottom: 15px;">Détails de la réservation</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <p style="margin: 5px 0;"><strong>Parking:</strong> ${selectedParking?.name}</p>
              <p style="margin: 5px 0;"><strong>Adresse:</strong> ${selectedParking?.address}</p>
              <p style="margin: 5px 0;"><strong>Client:</strong> ${selectedClient?.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${selectedClient?.email}</p>
            </div>
            <div>
              <p style="margin: 5px 0;"><strong>Date de début:</strong> ${new Date(formData.startTime).toLocaleString('fr-FR')}</p>
              <p style="margin: 5px 0;"><strong>Date de fin:</strong> ${new Date(formData.endTime).toLocaleString('fr-FR')}</p>
              <p style="margin: 5px 0;"><strong>Prix total:</strong> ${reservationDetails?.totalPrice}€</p>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 50px; color: #6b7280;">
          <p>Merci de votre confiance !</p>
        </div>
      </div>
    `;

    // Créer un style pour l'impression
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body { margin: 0; padding: 0; }
        @page { margin: 0; }
      }
    `;

    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Reçu de réservation</title>
            ${style.outerHTML}
          </head>
          <body>
            ${receiptElement.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="text-center">Chargement...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Nouvelle réservation</h1>
            <button
              onClick={() => router.push('/admin/reservations')}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              <p className="font-medium">Erreur</p>
              <p>{error}</p>
            </div>
          )}

          {reservationDetails ? (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="text-center mb-6">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Réservation créée avec succès !</h2>
                <p className="text-gray-600">Votre réservation a été enregistrée avec succès.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Détails de la réservation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Parking</p>
                    <p className="font-medium">{parkings.find(p => p._id === formData.parkingId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-medium">{clients.find(c => c._id === formData.clientId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date de début</p>
                    <p className="font-medium">{new Date(formData.startTime).toLocaleString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date de fin</p>
                    <p className="font-medium">{new Date(formData.endTime).toLocaleString('fr-FR')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Prix total</p>
                    <p className="text-xl font-bold text-blue-600">{reservationDetails.totalPrice}€</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimer le reçu
                </button>
                <button
                  onClick={() => router.push('/admin/reservations')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Retour à la liste
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking
                  </label>
                  <select
                    name="parkingId"
                    value={formData.parkingId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un parking</option>
                    {parkings.map((parking) => (
                      <option key={parking._id} value={parking._id}>
                        {parking.name} - {parking.address} (Places disponibles: {parking.availableSpots})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client
                  </label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name} - {client.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/admin/reservations')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Créer la réservation
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
} 