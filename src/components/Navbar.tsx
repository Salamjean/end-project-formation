'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  // Ne pas afficher la navbar sur les pages d'administration
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.headerTitle}>
            Parking Manager
          </Link>
          <nav className={styles.navLinks}>
            <Link 
              href="/parkings" 
              className={`${styles.navLink} ${pathname === '/parkings' ? styles.active : ''}`}
            >
              Parkings
            </Link>
            <Link 
              href="/services" 
              className={`${styles.navLink} ${pathname === '/services' ? styles.active : ''}`}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className={`${styles.navLink} ${pathname === '/about' ? styles.active : ''}`}
            >
              À propos de nous
            </Link>
            <Link 
              href="/contact" 
              className={`${styles.navLink} ${pathname === '/contact' ? styles.active : ''}`}
            >
              Contactez-nous
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 