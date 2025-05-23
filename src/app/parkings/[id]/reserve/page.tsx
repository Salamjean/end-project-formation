'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import styles from './page.module.css';

interface Parking {
  _id: string;
  name: string;
  address: string;
  pricePerHour: number;
}

export default function CreateReservationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    startDate: '',
    endDate: '',
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });

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
        setError('Impossible de charger les informations du parking');
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, [params.id]);

  const calculateTotalAmount = (start: string, end: string) => {
    if (!start || !end || !parking) return 0;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    const hours = Math.floor(diffHours);
    const minutes = Math.round((diffHours - hours) * 60);
    
    setDuration({ hours, minutes });
    
    const roundedHours = Math.ceil(diffHours * 4) / 4;
    return Math.ceil(roundedHours * parking.pricePerHour);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('Input changed:', { name, value });

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('New form data:', newData);
      
      // Recalculer le montant total si les dates changent
      if (name === 'startDate' || name === 'endDate') {
        const total = calculateTotalAmount(
          name === 'startDate' ? value : newData.startDate,
          name === 'endDate' ? value : newData.endDate
        );
        setTotalAmount(total);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    setSubmitting(true);
    setError(null);

    if (!formData.startDate || !formData.endDate) {
      console.log('Dates missing:', { startDate: formData.startDate, endDate: formData.endDate });
      setError('Les dates de début et de fin sont requises');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parkingId: params.id,
          clientName: `${formData.firstName} ${formData.lastName}`,
          clientEmail: formData.email,
          clientPhone: formData.contact,
          startDate: formData.startDate,
          endDate: formData.endDate,
          totalAmount
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Une erreur est survenue');
      }

      // Afficher l'alerte de succès
      await Swal.fire({
        title: 'Réservation réussie !',
        text: 'Votre réservation a été enregistrée avec succès.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });

      // Rediriger vers la page des parkings
      router.push('/parkings');
    } catch (error) {
      // Afficher l'alerte d'erreur
      await Swal.fire({
        title: 'Erreur',
        text: error instanceof Error ? error.message : 'Une erreur est survenue',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  if (!parking) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorMessage}>
          Parking non trouvé
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Réserver {parking.name}</h1>
        <p>{parking.address}</p>
      </div>

      <div className={styles.formContainer}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Votre prénom"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Votre nom"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Votre email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contact">Contact</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Votre numéro de téléphone"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startDate">Date et heure d'entrée</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            {formData.startDate && <small>Date sélectionnée: {formData.startDate}</small>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">Date et heure de sortie</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
            {formData.endDate && <small>Date sélectionnée: {formData.endDate}</small>}
          </div>

          {totalAmount > 0 && (
            <div className={styles.totalAmount}>
              <h3>Détail du calcul</h3>
              <div className={styles.calculationDetails}>
                <div className={styles.detailRow}>
                  <span>Durée de stationnement :</span>
                  <span>{duration.hours}h {duration.minutes}min</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Prix par heure :</span>
                  <span>{parking.pricePerHour}€</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Arrondi au quart d'heure :</span>
                  <span>{Math.ceil((duration.hours + duration.minutes / 60) * 4) / 4}h</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Montant total :</span>
                  <span className={styles.amount}>{totalAmount}€</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <Link href={`/parkings/${params.id}`} className={styles.cancelButton}>
              Annuler
            </Link>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? (
                <div className={styles.loading}>
                  <div className={styles.loadingSpinner} />
                  <span>Réservation en cours...</span>
                </div>
              ) : (
                'Confirmer la réservation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 