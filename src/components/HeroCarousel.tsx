'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './HeroCarousel.module.css';

const slides = [
  {
    id: 1,
    image: '/carousel/agence.jpg',
    title: 'Parking Sécurisé',
    description: 'Votre voiture en sécurité 24/7'
  },
  {
    id: 2,
    image: '/carousel/maison_ser.jpg',
    title: 'Facile d\'accès',
    description: 'Emplacements stratégiques en centre-ville'
  },
  {
    id: 3,
    image: '/carousel/espace-de-travail-avec-ecran-d-ordinateur-et-ordinateur-portable.jpg',
    title: 'Tarifs compétitifs',
    description: 'Des prix adaptés à tous les budgets'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.carousel}>
      <div className={styles.slides}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            <div className={styles.imageContainer}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: 'cover' }}
                priority={index === 0}
              />
            </div>
            <div className={styles.content}>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 