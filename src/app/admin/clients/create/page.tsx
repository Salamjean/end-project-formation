'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import './create.css'; // Import the CSS file

interface Parking {
  _id: string;
  name: string;
  address: string;
}

interface CarInfo {
  brand: string;
  model: string;
  color: string;
  licensePlate: string;
}

export default function CreateClient() {
  const router = useRouter();
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    parkingId: '',
    entryTime: '',
    exitTime: '',
  });
  const [carFormData, setCarFormData] = useState<CarInfo>({
    brand: '',
    model: '',
    color: '',
    licensePlate: '',
  });
  const [error, setError] = useState('');
  const [clientCreated, setClientCreated] = useState(false);
  const [createdClientData, setCreatedClientData] = useState<any>(null);

  useEffect(() => {
    fetchParkings();
    // Fermer le select quand on clique en dehors
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchParkings = async () => {
    try {
      const response = await fetch('/api/parkings');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des parkings');
      }
      const data = await response.json();
      setParkings(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Log des données avant l'envoi avec plus de détails
    console.log('FormData:', JSON.stringify(formData, null, 2));
    console.log('CarFormData:', JSON.stringify(carFormData, null, 2));

    try {
      // Créer l'objet avec toutes les informations
      const clientData = {
        ...formData,
        carBrand: carFormData.brand,
        carModel: carFormData.model,
        carColor: carFormData.color,
        carLicensePlate: carFormData.licensePlate,
      };

      console.log('Données envoyées à l\'API:', JSON.stringify(clientData, null, 2));

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      const responseData = await response.json();
      console.log('Réponse de l\'API:', JSON.stringify(responseData, null, 2));

      if (response.ok) {
        setCreatedClientData(responseData.client);
        setClientCreated(true);
      } else {
        setError(responseData.message || 'Erreur lors de la création du client');
      }
    } catch (err) {
      console.error('Erreur complète:', err);
      setError('Une erreur est survenue lors de la création du client.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('handleChange:', name, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value,
      };
      console.log('Nouveau formData:', JSON.stringify(newData, null, 2));
      return newData;
    });
  };

  const handleCarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('handleCarInputChange:', name, value);
    setCarFormData(prev => {
      const newData = {
        ...prev,
        [name]: value,
      };
      console.log('Nouveau carFormData:', JSON.stringify(newData, null, 2));
      return newData;
    });
  };

  const handleParkingSelect = (parkingId: string) => {
    setFormData(prev => ({
      ...prev,
      parkingId,
    }));
    setIsSelectOpen(false);
    setSearchTerm('');
  };

  const filteredParkings = parkings.filter(parking =>
    parking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parking.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedParking = parkings.find(p => p._id === formData.parkingId);

  const handlePrintReceipt = () => {
    if (!createdClientData) return;

    // Ajouter un log pour inspecter les données avant l'impression
    console.log('Données client pour le reçu :', createdClientData);

    const receiptElement = document.createElement('div');
    receiptElement.innerHTML = `
      <div class="receipt-container">
        <div class="receipt-header">
          <h1 class="receipt-title">Reçu d'enregistrement Client</h1>
          <p class="receipt-date">Date: ${new Date(createdClientData.createdAt).toLocaleDateString('fr-FR')}</p>
        </div>
        <div class="receipt-section">
          <h2 class="receipt-section-title">Informations Client</h2>
          <p><strong>Nom:</strong> ${createdClientData.name}</p>
          <p><strong>Email:</strong> ${createdClientData.email}</p>
          <p><strong>Téléphone:</strong> ${createdClientData.phone}</p>
          <p><strong>Adresse:</strong> ${createdClientData.address}</p>
          <p><strong>Parking attribué:</strong> ${selectedParking?.name}</p>
          <p><strong>Adresse du parking:</strong> ${selectedParking?.address}</p>
        </div>
        <div class="receipt-section">
          <h2 class="receipt-section-title">Informations Véhicule</h2>
          <p><strong>Marque:</strong> ${createdClientData.carBrand}</p>
          <p><strong>Modèle:</strong> ${createdClientData.carModel}</p>
          <p><strong>Couleur:</strong> ${createdClientData.carColor}</p>
          <p><strong>Plaque d'immatriculation:</strong> ${createdClientData.carLicensePlate}</p>
        </div>
        <div class="receipt-section">
          <h2 class="receipt-section-title">Horaires</h2>
          <p><strong>Heure d'entrée:</strong> ${new Date(createdClientData.entryTime).toLocaleString('fr-FR')}</p>
          <p><strong>Heure de sortie:</strong> ${new Date(createdClientData.exitTime).toLocaleString('fr-FR')}</p>
        </div>
        <div class="receipt-footer">
          <p>Ce reçu confirme l'enregistrement de votre compte client.</p>
          <p>Merci de faire partie de notre communauté !</p>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        .receipt-content, .receipt-content * { visibility: visible; }
        .receipt-content { position: absolute; left: 0; top: 0; width: 100%; }
      }
    `;
    receiptElement.classList.add('receipt-content');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Reçu Client</title>
            ${style.outerHTML}
          </head>
          <body>
            ${receiptElement.outerHTML}
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

  if (clientCreated && createdClientData) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-content">
          <div className="container">
            <div className="header" style={{ textAlign: 'center' }}>
              <h1 className="title">Client créé avec succès !</h1>
              <p className="subtitle">Les informations du client ont été enregistrées.</p>
            </div>
            <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto'}}>
              <div className="button-group" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
                <button
                  onClick={handlePrintReceipt}
                  className="btn btn-primary"
                >
                  Imprimer le reçu
                </button>
                <button
                  onClick={() => router.push('/admin/clients')}
                  className="btn btn-secondary"
                >
                  Retour à la liste des clients
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <main className="admin-content">
        <div className="container">
          <div className="header">
            <h1 className="title">Ajouter un nouveau client</h1>
            <p className="subtitle">Remplissez le formulaire ci-dessous pour créer un nouveau client</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-section">
              <h2 className="form-section-title">Informations Personnelles</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Informations Véhicule</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="carInfo.brand" className="form-label">
                    Marque
                  </label>
                  <input
                    type="text"
                    id="carInfo.brand"
                    name="brand"
                    value={carFormData.brand}
                    onChange={handleCarInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="carInfo.model" className="form-label">
                    Modèle
                  </label>
                  <input
                    type="text"
                    id="carInfo.model"
                    name="model"
                    value={carFormData.model}
                    onChange={handleCarInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="carInfo.color" className="form-label">
                    Couleur
                  </label>
                  <input
                    type="text"
                    id="carInfo.color"
                    name="color"
                    value={carFormData.color}
                    onChange={handleCarInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="carInfo.licensePlate" className="form-label">
                    Plaque d'immatriculation
                  </label>
                  <input
                    type="text"
                    id="carInfo.licensePlate"
                    name="licensePlate"
                    value={carFormData.licensePlate}
                    onChange={handleCarInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Horaires et Parking</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="entryTime" className="form-label">
                    Heure d'entrée
                  </label>
                  <input
                    type="datetime-local"
                    id="entryTime"
                    name="entryTime"
                    value={formData.entryTime}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="exitTime" className="form-label">
                    Heure de sortie
                  </label>
                  <input
                    type="datetime-local"
                    id="exitTime"
                    name="exitTime"
                    value={formData.exitTime}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="parkingId" className="form-label">
                    Sélectionner un parking
                  </label>
                  <div className="custom-select" ref={selectRef}>
                    <div 
                      className="select-header"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                    >
                      {selectedParking ? `${selectedParking.name} - ${selectedParking.address}` : 'Sélectionner un parking'}
                    </div>
                    {isSelectOpen && (
                      <div className="select-dropdown">
                        <input
                          type="text"
                          className="search-input"
                          placeholder="Rechercher un parking..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="options-list">
                          {filteredParkings.map((parking) => (
                            <div
                              key={parking._id}
                              className="option"
                              onClick={() => handleParkingSelect(parking._id)}
                            >
                              {parking.name} - {parking.address}
                            </div>
                          ))}
                          {filteredParkings.length === 0 && (
                            <div className="no-options">Aucun parking trouvé</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Créer le client
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 