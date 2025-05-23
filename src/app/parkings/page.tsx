'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Parking } from '@/models/Parking';
import styles from './parkings.module.css';

export default function ParkingsPage() {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
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
        setParkings(data);
        setFilteredParkings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  useEffect(() => {
    if (searchLocation.trim() === '') {
      setFilteredParkings(parkings);
    } else {
      const filtered = parkings.filter(parking =>
        parking.address.toLowerCase().includes(searchLocation.toLowerCase())
      );
      setFilteredParkings(filtered);
    }
  }, [searchLocation, parkings]);

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
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.searchSection}>
          <h1 className={styles.pageTitle}>Tous nos parkings</h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Rechercher par localisation..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.searchIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.parkingGrid}>
          {filteredParkings.map((parking) => (
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
                      target.src = '/carousel/agence.jpg';
                    }}
                  />
                ) : (
                  <Image
                    src="/carousel/agence.jpg"
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

        {filteredParkings.length === 0 && (
          <div className={styles.noResults}>
            <p>Aucun parking trouvé pour cette localisation.</p>
          </div>
        )}
      </div>
    </div>
  );
} 