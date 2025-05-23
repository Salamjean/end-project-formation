'use client';

import { useRouter } from 'next/navigation';
import { Building2, Users, Target, Award, Clock, Shield } from 'lucide-react';
import styles from './about.module.css';

interface Value {
  id: number;
  title: string;
  description: string;
  icon: any;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

const values: Value[] = [
  {
    id: 1,
    title: "Innovation",
    description: "Nous développons constamment de nouvelles solutions pour améliorer votre expérience de stationnement.",
    icon: Target
  },
  {
    id: 2,
    title: "Sécurité",
    description: "La sécurité de votre véhicule est notre priorité absolue, avec des systèmes de surveillance de pointe.",
    icon: Shield
  },
  {
    id: 3,
    title: "Service",
    description: "Notre équipe est disponible 24/7 pour vous offrir un service exceptionnel et personnalisé.",
    icon: Users
  }
];

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Salam Jean-Louis",
    role: "Directeur Général",
    image: "/team/ceo.jpg"
  },
  {
    id: 2,
    name: "Kassi Kassim",
    role: "Directrice des Opérations",
    image: "/team/operations.jpg"
  },
  {
    id: 3,
    name: "Julien Koffi",
    role: "Responsable Technique",
    image: "/team/technical.jpg"
  }
];

export default function AboutPage() {
  const router = useRouter();

  const handleCTAClick = () => {
    router.push('/parkings');
  };

  return (
    <div className={styles.container}>
      {/* Section Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>À Propos de Nous</h1>
          <p className={styles.heroSubtitle}>
            Votre partenaire de confiance pour le stationnement intelligent
          </p>
        </div>
      </div>

      {/* Section Notre Histoire */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Notre Histoire</h2>
          <div className={styles.storyContent}>
            <div className={styles.storyText}>
              <p>
                Fondée en 2025, notre entreprise est née d'une vision simple : révolutionner l'expérience 
                du stationnement en ville. Nous avons commencé avec un seul parking et avons grandi pour 
                devenir un leader dans le domaine du stationnement intelligent.
              </p>
              <p>
                Aujourd'hui, nous gérons plus de 50 parkings à travers le pays, offrant des solutions 
                innovantes et sécurisées à des milliers de clients quotidiens.
              </p>
            </div>
            <div className={styles.storyStats}>
              <div className={styles.stat}>
                <Building2 size={32} />
                <span className={styles.statNumber}>50+</span>
                <span className={styles.statLabel}>Parkings</span>
              </div>
              <div className={styles.stat}>
                <Users size={32} />
                <span className={styles.statNumber}>100K+</span>
                <span className={styles.statLabel}>Clients</span>
              </div>
              <div className={styles.stat}>
                <Clock size={32} />
                <span className={styles.statNumber}>24/7</span>
                <span className={styles.statLabel}>Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Nos Valeurs */}
      <section className={`${styles.section} ${styles.valuesSection}`}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Nos Valeurs</h2>
          <div className={styles.valuesGrid}>
            {values.map((value) => (
              <div key={value.id} className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <value.icon size={32} />
                </div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Notre Équipe */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Notre Équipe</h2>
          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <div key={member.id} className={styles.teamCard}>
                <div className={styles.teamImage}>
                  <img src={member.image} alt={member.name} />
                </div>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Rejoignez-nous dans cette aventure</h2>
          <p className={styles.ctaText}>
            Découvrez nos parkings et profitez d'une expérience de stationnement exceptionnelle
          </p>
          <button 
            className={styles.ctaButton}
            onClick={handleCTAClick}
          >
            Découvrir nos parkings
          </button>
        </div>
      </section>
    </div>
  );
} 