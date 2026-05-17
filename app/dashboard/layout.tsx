'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LogOut, Home, Package, FileText, CreditCard, User, PanelLeft, X, AlertCircle, Shield, Bell, Plus, Star } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  const handleLogout = () => { logout(); router.push('/login'); };

  const navItems = [
    { label: 'Overview', icon: Home, href: '/dashboard' },
    { label: 'Bookings', icon: Package, href: '/dashboard/bookings' },
    { label: 'Reports', icon: FileText, href: '/dashboard/reports' },
    { label: 'Invoices', icon: CreditCard, href: '/dashboard/invoices' },
    { label: 'Complaints', icon: AlertCircle, href: '/dashboard/complaints' },
    { label: 'Profile', icon: User, href: '/dashboard/profile' },
  ];

  if (!isAuthenticated) return null;

  const pageTitle = navItems.find(n => n.href === pathname)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Sidebar */}
      <aside className={cn(
        'bg-forest-900 texture-organic transition-all duration-300 flex-shrink-0',
        sidebarOpen ? 'w-64' : 'w-20',
        'hidden md:flex md:flex-col h-screen sticky top-0'
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-heading font-bold text-white text-sm">PestShield Pro</p>
                <p className="text-emerald-300 text-[11px] font-medium uppercase tracking-wider">Customer Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                  isActive
                    ? 'bg-white/10 text-white border-l-2 border-emerald-400 font-semibold pl-2'
                    : 'text-white/85 hover:text-white hover:bg-white/15'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info card */}
        <div className="p-3 border-t border-white/10">
          {sidebarOpen ? (
            <div className="bg-white/12 rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-black text-forest-900">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white/85 text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-white/85 text-xs truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5" />
                {user?.loyaltyPoints || 0} Loyalty Points
              </div>
            </div>
          ) : null}
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition-colors w-full px-3 py-2 rounded-xl hover:bg-white/5',
              !sidebarOpen && 'justify-center'
            )}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-cream-50 border-b border-cream-300 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex p-2 rounded-xl hover:bg-cream-200 transition-colors text-neutral-600"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading font-bold text-ink text-lg">{pageTitle}</h1>
              <p className="text-xs text-neutral-500">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-cream-200 transition-colors text-neutral-600">
              <Bell className="w-5 h-5" />
            </button>
            <Link
              href="/book"
              className="flex items-center gap-1.5 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-full text-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Book Now
            </Link>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest-900 border-t border-white/10 flex items-center justify-around px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-3 rounded-xl transition-colors min-w-[48px]',
                isActive ? 'text-emerald-400' : 'text-white/85'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
