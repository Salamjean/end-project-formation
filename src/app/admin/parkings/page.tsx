'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

interface ParkingType {
  _id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  pricePerHour: number;
  description: string;
  image?: string;
}

export default function ParkingsList() {
  const router = useRouter();
  const [parkings, setParkings] = useState<ParkingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch('/api/parkings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des parkings');
        }

        const data = await response.json();
        setParkings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce parking ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`/api/parkings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du parking');
      }

      setParkings(parkings.filter(parking => parking._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
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
          <h1 className="admin-title">Liste des parkings</h1>
          <Link href="/admin/parkings/create" className="btn btn-primary">
            Ajouter un parking
          </Link>
        </div>

        <div className="dashboard-grid">
          {parkings.map((parking) => (
            <div key={parking._id} className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">{parking.name}</h3>
                <span className="dashboard-card-badge">
                  {parking.availableSpots} places disponibles
                </span>
              </div>
              <div className="dashboard-card-content">
                <p className="dashboard-card-address">{parking.address}</p>
                <p className="dashboard-card-price">{parking.pricePerHour}€/heure</p>
              </div>
              <div className="dashboard-card-actions">
                <Link
                  href={`/admin/parkings/${parking._id}/edit`}
                  className="btn btn-secondary"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(parking._id)}
                  className="btn btn-danger"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 