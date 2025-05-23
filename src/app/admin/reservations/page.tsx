'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import Sidebar from '@/components/Sidebar';
import './reservations.css';

export default function AdminReservationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, [searchParams]);

  const fetchReservations = async () => {
    try {
      const status = searchParams.get('status');
      const url = status ? `/api/reservations?status=${status}` : '/api/reservations';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des réservations');
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReservation = async (id: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'confirmed' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la confirmation de la réservation');
      }

      fetchReservations();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la réservation');
      }

      fetchReservations();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Gestion des Réservations</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="reservations-container">
          {reservations.length === 0 ? (
            <div className="no-reservations">
              <div className="no-reservations-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h2>Aucune réservation trouvée</h2>
              <p>Il n'y a actuellement aucune réservation {searchParams.get('status') ? `avec le statut "${searchParams.get('status')}"` : 'dans le système'}.</p>
            </div>
          ) : (
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Parking</th>
                  <th>Période</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation: any) => (
                  <tr key={reservation._id}>
                    <td>
                      <div className="client-info">
                        <span className="client-name">{reservation.clientName}</span>
                        <span className="client-details">{reservation.clientEmail}</span>
                        <span className="client-details">{reservation.clientPhone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="client-info">
                        <span className="client-name">{reservation.parkingId?.name}</span>
                        <span className="client-details">{reservation.parkingId?.address}</span>
                      </div>
                    </td>
                    <td>
                      <div className="client-info">
                        <span className="client-name">
                          Du {new Date(reservation.startDate).toLocaleString()}
                        </span>
                        <span className="client-details">
                          Au {new Date(reservation.endDate).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        reservation.status === 'confirmed' 
                          ? 'status-confirmed'
                          : reservation.status === 'cancelled'
                          ? 'status-cancelled'
                          : 'status-pending'
                      }`}>
                        {reservation.status === 'confirmed' 
                          ? 'Confirmée'
                          : reservation.status === 'cancelled'
                          ? 'Annulée'
                          : 'En attente'}
                      </span>
                    </td>
                    <td>
                      {reservation.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleConfirmReservation(reservation._id)}
                            className="btn btn-confirm"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => handleCancelReservation(reservation._id)}
                            className="btn btn-cancel"
                          >
                            Annuler
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 