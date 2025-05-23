'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Parking from '@/models/Parking';
import ReservationForm from '@/components/ReservationForm';
import { MapPin, Clock, Car, Euro } from 'lucide-react';
import styles from './page.module.css';

interface Parking {
  _id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  pricePerHour: number;
  description?: string;
  images?: string[];
  openingHours: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function ParkingDetailPage({ params }: PageProps) {
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const response = await fetch(`/api/parkings/${params.id}`);
        if (!response.ok) {
          throw new Error('Parking not found');
        }
        const data = await response.json();
        setParking(data);
      } catch (error) {
        console.error('Error fetching parking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, [params.id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!parking) {
    return <div>Parking non trouvé</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {/* En-tête avec image de fond */}
      <div 
        className={styles.header}
        style={{
          backgroundImage: parking.images && parking.images.length > 0 
            ? `url(${parking.images[0]})`
            : 'url(/carousel/agence.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className={styles.headerOverlay} />
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>{parking.name}</h1>
            <p className={styles.headerAddress}>
              <MapPin className={styles.infoIcon} />
              {parking.address}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.gridContainer}>
          {/* Colonne de gauche - Informations du parking */}
          <div className={styles.infoSection}>
            {/* Carte des informations principales */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Informations du parking</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <Car className={styles.infoIcon} />
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Places disponibles</span>
                    <span className={styles.infoValue}>{parking.availableSpots} places</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Euro className={styles.infoIcon} />
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Prix par heure</span>
                    <span className={styles.infoValue}>{parking.pricePerHour}€</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Clock className={styles.infoIcon} />
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Horaires d'ouverture</span>
                    <span className={styles.infoValue}>{parking.openingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description si disponible */}
            {parking.description && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Description</h2>
                <p className={styles.description}>
                  {parking.description}
                </p>
              </div>
            )}
          </div>

          {/* Colonne de droite - Bouton de réservation */}
          <div className={styles.reservationSection}>
            <div className={styles.reservationCard}>
              <h2 className={styles.cardTitle}>Réserver ce parking</h2>
              <div className={styles.reservationInfo}>
                <div className={styles.infoItem}>
                  <Car className={styles.infoIcon} />
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Places disponibles</span>
                    <span className={styles.infoValue}>{parking.availableSpots} places</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Euro className={styles.infoIcon} />
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Prix par heure</span>
                    <span className={styles.infoValue}>{parking.pricePerHour}€</span>
                  </div>
                </div>
              </div>
              <Link 
                href={`/parkings/${parking._id}/reserve`}
                className={styles.reserveButton}
              >
                Réserver maintenant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 