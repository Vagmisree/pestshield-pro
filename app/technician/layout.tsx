'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LogOut, Home, Briefcase, User, Shield, MapPin } from 'lucide-react';
import { api } from '@/lib/api';

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, role, logout } = useAuthStore();
  const [locationActive, setLocationActive] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (role && role !== 'TECHNICIAN') { router.push('/dashboard'); return; }
  }, [isAuthenticated, role, router]);

  // Background location updates every 5 minutes
  useEffect(() => {
    if (!isAuthenticated || role !== 'TECHNICIAN') return;
    if (!navigator.geolocation) return;

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          api.patch('/technicians/me/location', { lat: pos.coords.latitude, lng: pos.coords.longitude })
            .then(() => setLocationActive(true))
            .catch(() => {});
        },
        () => {}
      );
    };

    sendLocation();
    const interval = setInterval(sendLocation, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, role]);

  if (!isAuthenticated || role !== 'TECHNICIAN') return null;

  const navItems = [
    { label: 'Dashboard', icon: Home, href: '/technician' },
    { label: 'My Jobs', icon: Briefcase, href: '/technician/jobs' },
    { label: 'Profile', icon: User, href: '/technician/profile' },
  ];

  const pageTitle = navItems.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label || 'Technician';

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Top header */}
      <header className="bg-forest-900 texture-organic px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">{user?.name}</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-[10px] font-bold uppercase tracking-wider">Technician</span>
              {locationActive && (
                <span className="flex items-center gap-1 text-white/60 text-[10px]">
                  <MapPin className="w-2.5 h-2.5" /> Location active
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => { logout(); router.push('/login'); }}
          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </header>

      {/* Page content */}
      <main className="pb-20 md:pb-6 max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-forest-900 border-t border-white/10 flex items-center justify-around px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/technician' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={cn('flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-colors',
                isActive ? 'text-emerald-400' : 'text-white/85')}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
