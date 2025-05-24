'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Parking } from '@/models/Parking';
import HeroCarousel from '@/components/HeroCarousel';
import styles from './page.module.css';

export default function Home() {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await fetch('/api/parkings');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des parkings');
        }
        const data = await response.json();
        // Filtrer uniquement les parkings actifs
        const activeParkings = data.filter((parking: Parking) => parking.isActive);
        setParkings(activeParkings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorMessage}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <HeroCarousel />

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Parkings Disponibles</h2>
          <div className={styles.parkingGrid}>
            {parkings.map((parking) => (
              <div key={parking._id} className={styles.parkingCard}>
                <div className={styles.parkingImage}>
                  {parking.images && parking.images.length > 0 ? (
                    <Image
                      src={parking.images[0]}
                      alt={parking.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                      }}
                    />
                  ) : (
                    <Image
                      alt={parking.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <span className={styles.availabilityBadge}>
                    {parking.availableSpots} places disponibles
                  </span>
                </div>
                <div className={styles.parkingInfo}>
                  <h3 className={styles.parkingName}>{parking.name}</h3>
                  <p className={styles.parkingAddress}>{parking.address}</p>
                  <p className={styles.parkingPrice}>{parking.pricePerHour}€/heure</p>
                  <div className={styles.parkingActions}>
                    <Link
                      href={`/parkings/${parking._id}`}
                      className={styles.detailsButton}
                    >
                      Voir les détails
                    </Link>
                    <Link
                      href={`/parkings/${parking._id}/reserve`}
                      className={styles.reserveButton}
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
