'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Swal from 'sweetalert2';
import './clients.css';

interface ClientType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  carBrand: string;
  carModel: string;
  carColor: string;
  carLicensePlate: string;
  entryTime: string;
  exitTime: string;
  createdAt: string;
  parkingId: {
    _id: string;
    name: string;
    address: string;
  };
}

export default function ClientsList() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientType[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des clients');
        }
        const data = await response.json();
        setClients(data);
        setFilteredClients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client => {
      const searchLower = searchTerm.toLowerCase();
      return (
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.toLowerCase().includes(searchLower) ||
        client.carBrand.toLowerCase().includes(searchLower) ||
        client.carModel.toLowerCase().includes(searchLower) ||
        client.carLicensePlate.toLowerCase().includes(searchLower) ||
        client.parkingId?.name.toLowerCase().includes(searchLower)
      );
    });
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/clients/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du client');
        }

        setClients(clients.filter(client => client._id !== id));
        
        Swal.fire(
          'Supprimé !',
          'Le client a été supprimé avec succès.',
          'success'
        );
      } catch (err) {
        Swal.fire(
          'Erreur !',
          err instanceof Error ? err.message : 'Une erreur est survenue',
          'error'
        );
      }
    }
  };

  const handlePrint = (client: ClientType) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Reçu de stationnement - ${client.name}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              body {
                font-family: 'Poppins', sans-serif;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
                background-color: #f8fafc;
              }

              .receipt {
                background-color: white;
                border-radius: 0.75rem;
                box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
                padding: 2rem;
                position: relative;
              }

              .client-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                background-color: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
                margin-bottom: 1rem;
              }

              .client-name {
                font-size: 1.125rem;
                font-weight: 600;
                color: #1e293b;
                margin: 0;
              }

              .client-details,
              .vehicle-section,
              .parking-section,
              .time-section {
                padding: 1rem;
                border-bottom: 1px solid #e2e8f0;
                margin-bottom: 1rem;
              }

              .section-title {
                font-size: 1rem;
                font-weight: 600;
                color: #475569;
                margin: 0 0 0.75rem 0;
              }

              .detail-group {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
              }

              .detail-group:last-child {
                margin-bottom: 0;
              }

              .detail-label {
                color: #64748b;
                font-size: 0.875rem;
              }

              .detail-value {
                color: #334155;
                font-weight: 500;
                font-size: 0.875rem;
              }

              .footer {
                text-align: center;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid #e2e8f0;
                color: #64748b;
                font-size: 0.875rem;
              }

              @media print {
                body {
                  padding: 0;
                  background-color: white;
                }

                .receipt {
                  box-shadow: none;
                }

                .client-header,
                .client-details,
                .vehicle-section,
                .parking-section,
                .time-section {
                  break-inside: avoid;
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="client-header">
                <h3 class="client-name">${client.name}</h3>
                <div class="receipt-date">${new Date().toLocaleDateString()}</div>
              </div>
              
              <div class="client-details">
                <div class="detail-group">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${client.email}</span>
                </div>
                <div class="detail-group">
                  <span class="detail-label">Téléphone:</span>
                  <span class="detail-value">${client.phone}</span>
                </div>
              </div>

              <div class="vehicle-section">
                <h4 class="section-title">Véhicule</h4>
                <div class="detail-group">
                  <span class="detail-label">Marque:</span>
                  <span class="detail-value">${client.carBrand}</span>
                </div>
                <div class="detail-group">
                  <span class="detail-label">Modèle:</span>
                  <span class="detail-value">${client.carModel}</span>
                </div>
                <div class="detail-group">
                  <span class="detail-label">Couleur:</span>
                  <span class="detail-value">${client.carColor}</span>
                </div>
                <div class="detail-group">
                  <span class="detail-label">Plaque:</span>
                  <span class="detail-value">${client.carLicensePlate}</span>
                </div>
              </div>

              <div class="parking-section">
                <h4 class="section-title">Parking</h4>
                <div class="detail-group">
                  <span class="detail-label">Nom:</span>
                  <span class="detail-value">${client.parkingId?.name}</span>
                </div>
                <div class="detail-group">
                  <span class="detail-label">Adresse:</span>
                  <span class="detail-value">${client.parkingId?.address}</span>
                </div>
              </div>

              <div class="time-section">
                <h4 class="section-title">Horaires</h4>
                <div class="detail-group">
                  <span class="detail-label">Entrée:</span>
                  <span class="detail-value">${new Date(client.entryTime).toLocaleString()}</span>
                </div>
                <div class="detail-group">
                  <span class="detail-label">Sortie:</span>
                  <span class="detail-value">${new Date(client.exitTime).toLocaleString()}</span>
                </div>
              </div>

              <div class="footer">
                <p>Merci de votre confiance</p>
                <p>Ce reçu est une preuve de stationnement valide</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Liste des clients</h1>
          <button 
            onClick={() => router.push('/admin/clients/create')}
            className="btn btn-primary"
          >
            <i className="fas fa-plus"></i>
            Ajouter un client
          </button>
        </div>

        <div className="card">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>

          <div className="clients-grid">
            {filteredClients.map((client) => (
              <div key={client._id} className="client-card">
                <div className="client-header">
                  <h3 className="client-name">{client.name}</h3>
                  <div className="client-actions">
                    <button
                      onClick={() => router.push(`/admin/clients/${client._id}/edit`)}
                      className="btn btn-secondary btn-sm"
                      title="Modifier"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="btn btn-danger btn-sm"
                      title="Supprimer"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button
                      onClick={() => handlePrint(client)}
                      className="btn btn-info btn-sm"
                      title="Imprimer le reçu"
                    >
                      <i className="fas fa-print"></i>
                    </button>
                  </div>
                </div>
                
                <div className="client-details">
                  <div className="detail-group">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{client.email}</span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Téléphone:</span>
                    <span className="detail-value">{client.phone}</span>
                  </div>
                </div>

                <div className="vehicle-section">
                  <h4 className="section-title">Véhicule</h4>
                  <div className="vehicle-details">
                    <div className="detail-group">
                      <span className="detail-label">Marque:</span>
                      <span className="detail-value">{client.carBrand}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Modèle:</span>
                      <span className="detail-value">{client.carModel}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Couleur:</span>
                      <span className="detail-value">{client.carColor}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Plaque:</span>
                      <span className="detail-value">{client.carLicensePlate}</span>
                    </div>
                  </div>
                </div>

                <div className="parking-section">
                  <h4 className="section-title">Parking</h4>
                  <div className="parking-details">
                    <div className="detail-group">
                      <span className="detail-label">Nom:</span>
                      <span className="detail-value">{client.parkingId?.name}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Adresse:</span>
                      <span className="detail-value">{client.parkingId?.address}</span>
                    </div>
                  </div>
                </div>

                <div className="time-section">
                  <h4 className="section-title">Horaires</h4>
                  <div className="time-details">
                    <div className="detail-group">
                      <span className="detail-label">Entrée:</span>
                      <span className="detail-value">{new Date(client.entryTime).toLocaleString()}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Sortie:</span>
                      <span className="detail-value">{new Date(client.exitTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 