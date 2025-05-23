'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, LayoutDashboard, Car, Users, Calendar, ChevronDown } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isReservationsOpen, setIsReservationsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    router.push('/admin/login');
  };

  const menuItems = [
    {
      href: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Tableau de bord',
    },
    {
      href: '/admin/parkings',
      icon: <Car size={20} />,
      label: 'Parkings',
    },
    {
      href: '/admin/clients',
      icon: <Users size={20} />,
      label: 'Clients',
    },
  ];

  const reservationItems = [
    {
      href: '/admin/reservations',
      label: 'Toutes les réservations',
    },
    {
      href: '/admin/reservations?status=pending',
      label: 'Réservations en attente',
    },
    {
      href: '/admin/reservations?status=confirmed',
      label: 'Réservations confirmées',
    },
    {
      href: '/admin/reservations?status=cancelled',
      label: 'Réservations annulées',
    },
  ];

  // Ne pas afficher le logo sur la page de création de parking
  const showLogo = !pathname?.includes('/create-parking');

  return (
    <aside className="sidebar">
      {showLogo && (
        <div className="sidebar-header">
          <h1 className="sidebar-title">Parking Manager</h1>
        </div>
      )}

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="sidebar-dropdown">
          <button
            className={`sidebar-link ${pathname?.includes('/admin/reservations') ? 'active' : ''}`}
            onClick={() => setIsReservationsOpen(!isReservationsOpen)}
          >
            <Calendar size={20} />
            <span>Réservations</span>
            <ChevronDown 
              size={20}
              className={`transition-transform ${isReservationsOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {isReservationsOpen && (
            <div className="sidebar-dropdown-content">
              {reservationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-dropdown-link ${
                    pathname === item.href ? 'active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <button onClick={handleLogout} className="sidebar-logout">
        <LogOut size={20} />
        <span>Déconnexion</span>
      </button>
    </aside>
  );
} 