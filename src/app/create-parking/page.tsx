"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function CreateParking() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    totalSpaces: "",
    pricePerHour: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/parkings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          totalSpaces: parseInt(formData.totalSpaces),
          pricePerHour: parseFloat(formData.pricePerHour),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du parking");
      }

      router.push("/admin/parkings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4 bg-light">
        <div className="container py-4">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Nouveau parking</h1>
              </div>

              <div className="card shadow-sm">
                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">
                          Nom du parking
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          placeholder="Entrez le nom du parking"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="address" className="form-label">
                          Adresse
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          required
                          placeholder="Entrez l'adresse du parking"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="totalSpaces" className="form-label">
                          Nombre de places
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="totalSpaces"
                          value={formData.totalSpaces}
                          onChange={(e) =>
                            setFormData({ ...formData, totalSpaces: e.target.value })
                          }
                          required
                          min="1"
                          placeholder="Entrez le nombre de places"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="pricePerHour" className="form-label">
                          Prix par heure (€)
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            id="pricePerHour"
                            value={formData.pricePerHour}
                            onChange={(e) =>
                              setFormData({ ...formData, pricePerHour: e.target.value })
                            }
                            required
                            min="0"
                            step="0.01"
                            placeholder="Entrez le prix par heure"
                          />
                          <span className="input-group-text">€</span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => router.back()}
                        disabled={loading}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Création...
                          </>
                        ) : (
                          "Créer le parking"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 