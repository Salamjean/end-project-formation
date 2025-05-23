'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function EditParking({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parking, setParking] = useState<ParkingType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalSpots: '',
    pricePerHour: '',
    description: '',
  });

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch(`/api/parkings/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement du parking');
        }

        const data = await response.json();
        setParking(data);
        setFormData({
          name: data.name,
          address: data.address,
          totalSpots: data.totalSpots.toString(),
          pricePerHour: data.pricePerHour.toString(),
          description: data.description,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`/api/parkings/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          totalSpots: parseInt(formData.totalSpots),
          pricePerHour: parseFloat(formData.pricePerHour),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du parking');
      }

      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <h1 className="admin-title">Modifier le parking</h1>
          <button onClick={() => router.back()} className="btn btn-secondary">
            Retour
          </button>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nom du parking</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">Adresse</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalSpots" className="form-label">Nombre total de places</label>
            <input
              type="number"
              id="totalSpots"
              name="totalSpots"
              value={formData.totalSpots}
              onChange={handleChange}
              className="form-input"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pricePerHour" className="form-label">Prix par heure (€)</label>
            <input
              type="number"
              id="pricePerHour"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows={4}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
} 