'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ImageUpload from '@/components/ImageUpload';
import './create.css';

export default function CreateParking() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalSpots: '',
    pricePerHour: '',
    description: '',
    images: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/parkings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalSpots: parseInt(formData.totalSpots),
          pricePerHour: parseFloat(formData.pricePerHour),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      router.push('/admin/parkings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="container">
          <div className="header">
            <h1 className="title">Ajouter un parking</h1>
            <p className="subtitle">Remplissez le formulaire ci-dessous pour créer un nouveau parking</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nom du parking
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Entrez le nom du parking"
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
                  required
                  className="form-input"
                  placeholder="Entrez l'adresse du parking"
                />
              </div>

              <div className="form-group">
                <label htmlFor="totalSpots" className="form-label">
                  Nombre total de places
                </label>
                <input
                  type="number"
                  id="totalSpots"
                  name="totalSpots"
                  value={formData.totalSpots}
                  onChange={handleChange}
                  required
                  min="1"
                  className="form-input"
                  placeholder="Entrez le nombre de places"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pricePerHour" className="form-label">
                  Prix par heure (€)
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    id="pricePerHour"
                    name="pricePerHour"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="form-input"
                    placeholder="Entrez le prix par heure"
                  />
                  <span className="input-group-text">€</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="form-input"
                placeholder="Entrez une description du parking"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Images du parking
              </label>
              <div className="image-upload-container">
                <ImageUpload
                  images={formData.images}
                  setImages={(images) => setFormData(prev => ({ ...prev, images }))}
                />
              </div>
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <span className="spinner-border-sm" role="status" aria-hidden="true"></span>
                    Création en cours...
                  </>
                ) : (
                  'Créer le parking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 