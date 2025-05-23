'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import './dashboard.css';

interface DashboardStats {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  cancelledReservations: number;
  totalParkings: number;
  totalSpots: number;
  totalAvailableSpots: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/admin/login');
          return;
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setStats(data);
      setError('');
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error instanceof Error ? error.message : 'Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <p className="loading-text">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <div className="error-container">
            <h2 className="error-title">Erreur</h2>
            <p className="error-message">{error}</p>
            <button 
              onClick={fetchStats} 
              className="retry-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M22 11.5A10 10 0 0 0 9.004 3.5M2 12.5a10 10 0 0 0 13 8"></path>
              </svg>
              Réessayer
            </button>
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
          <h1 className="admin-title">Tableau de bord</h1>
          <button 
            onClick={fetchStats} 
            className="refresh-button"
            aria-label="Rafraîchir les données"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M22 11.5A10 10 0 0 0 9.004 3.5M2 12.5a10 10 0 0 0 13 8"></path>
            </svg>
          </button>
        </div>

        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Total des réservations</h3>
                <p className="stat-number">{stats?.totalReservations || 0}</p>
                <p className="stat-description">Toutes les réservations</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon confirmed">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Confirmées</h3>
                <p className="stat-number">{stats?.confirmedReservations || 0}</p>
                <p className="stat-description">Réservations validées</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="stat-content">
                <h3>En attente</h3>
                <p className="stat-number">{stats?.pendingReservations || 0}</p>
                <p className="stat-description">En cours de traitement</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon cancelled">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Annulées</h3>
                <p className="stat-number">{stats?.cancelledReservations || 0}</p>
                <p className="stat-description">Réservations annulées</p>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon parking">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Parkings</h3>
                <p className="stat-number">{stats?.totalParkings || 0}</p>
                <p className="stat-description">Parkings enregistrés</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon spots">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Places totales</h3>
                <p className="stat-number">{stats?.totalSpots || 0}</p>
                <p className="stat-description">Capacité totale</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon available">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M12 11v4"></path>
                  <path d="M10 13h4"></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Places disponibles</h3>
                <p className="stat-number">{stats?.totalAvailableSpots || 0}</p>
                <p className="stat-description">Places libres actuellement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}