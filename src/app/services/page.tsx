'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Clock, Shield, CreditCard, Wifi, Coffee, Key, Phone } from 'lucide-react';
import styles from './services.module.css';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: any;
  features: string[];
}

const services: Service[] = [
  {
    id: 1,
    title: "Stationnement Sécurisé",
    description: "Votre véhicule est sous surveillance 24h/24 et 7j/7 avec notre système de sécurité de pointe.",
    icon: Shield,
    features: [
      "Surveillance vidéo 24/7",
      "Accès contrôlé",
      "Éclairage permanent",
      "Personnel de sécurité"
    ]
  },
  {
    id: 2,
    title: "Réservation en Ligne",
    description: "Réservez votre place de parking en quelques clics, à tout moment et depuis n'importe où.",
    icon: Car,
    features: [
      "Réservation instantanée",
      "Confirmation immédiate",
      "Modification flexible",
      "Annulation gratuite"
    ]
  },
  {
    id: 3,
    title: "Paiement Simplifié",
    description: "Payez facilement avec nos multiples options de paiement sécurisées.",
    icon: CreditCard,
    features: [
      "Cartes bancaires",
      "Paiement mobile",
      "Facturation automatique",
      "Reçus électroniques"
    ]
  },
  {
    id: 4,
    title: "Services Additionnels",
    description: "Profitez de nos services complémentaires pour un confort optimal.",
    icon: Coffee,
    features: [
      "Station de lavage",
      "Recharge électrique",
      "Service de conciergerie",
      "Espace détente"
    ]
  }
];

export default function ServicesPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleReserveClick = () => {
    router.push('/parkings');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nos Services</h1>
        <p className={styles.subtitle}>
          Découvrez l'ensemble des services que nous proposons pour rendre votre expérience de stationnement plus agréable
        </p>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service) => (
          <div 
            key={service.id} 
            className={`${styles.serviceCard} ${selectedService?.id === service.id ? styles.selected : ''}`}
            onClick={() => setSelectedService(service)}
          >
            <div className={styles.serviceIcon}>
              <service.icon size={32} />
            </div>
            <h2 className={styles.serviceTitle}>{service.title}</h2>
            <p className={styles.serviceDescription}>{service.description}</p>
            <ul className={styles.featuresList}>
              {service.features.map((feature, index) => (
                <li key={index} className={styles.feature}>
                  <span className={styles.featureDot}></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.contactSection}>
        <h2 className={styles.contactTitle}>Besoin d'aide ?</h2>
        <p className={styles.contactText}>
          Notre équipe est disponible 24/7 pour répondre à vos questions et vous assister.
        </p>
        <div className={styles.contactButtons}>
          <button className={styles.contactButton}>
            <Phone size={20} />
            Nous contacter
          </button>
          <button 
            className={styles.contactButton}
            onClick={handleReserveClick}
          >
            <Key size={20} />
            Réserver maintenant
          </button>
        </div>
      </div>
    </div>
  );
} 