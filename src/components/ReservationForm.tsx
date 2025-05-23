'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ReservationForm.module.css';

interface ReservationFormProps {
  parkingId: string;
  parkingName: string;
}

export default function ReservationForm({ parkingId, parkingName }: ReservationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!formData.clientName.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!formData.clientEmail.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      setError('L\'email n\'est pas valide');
      return false;
    }
    if (!formData.clientPhone.trim()) {
      setError('Le numéro de téléphone est requis');
      return false;
    }
    if (!formData.startDate) {
      setError('La date de début est requise');
      return false;
    }
    if (!formData.endDate) {
      setError('La date de fin est requise');
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('La date de fin doit être postérieure à la date de début');
      return false;
    }
    if (new Date(formData.startDate) < new Date()) {
      setError('La date de début ne peut pas être dans le passé');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parkingId,
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      if (!data.reservation || !data.reservation._id) {
        throw new Error('Erreur lors de la création de la réservation : ID manquant');
      }

      router.push(`/reservation-confirmation/${data.reservation._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Effacer l'erreur quand l'utilisateur modifie un champ
  };

  return (
    <div className={styles.formContainer}>
      <h2>Réserver {parkingName}</h2>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="clientName">Nom complet</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Entrez votre nom complet"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="clientEmail">Email</label>
          <input
            type="email"
            id="clientEmail"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            placeholder="exemple@email.com"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="clientPhone">Téléphone</label>
          <input
            type="tel"
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            placeholder="06 12 34 56 78"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startDate">Date de début</label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endDate">Date de fin</label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate || new Date().toISOString().slice(0, 16)}
            required
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Réservation en cours...' : 'Confirmer la réservation'}
        </button>
      </form>
    </div>
  );
} 