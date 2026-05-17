'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, BarChart3, Zap, Users, AlertCircle, FileText, Shield, Menu, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Allow access if authenticated (admin check would be role-based in production)
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, pathname, router]);

  // Don't render layout on login page
  if (pathname === '/admin/login') return <>{children}</>;

  const adminMenuItems = [
    { label: 'Dashboard', href: '/admin', icon: BarChart3 },
    { label: 'Bookings', href: '/admin/bookings', icon: Zap },
    { label: 'Technicians', href: '/admin/technicians', icon: Users },
    { label: 'Complaints', href: '/admin/complaints', icon: AlertCircle },
    { label: 'Reports', href: '/admin/reports', icon: FileText },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  ];

  const handleLogout = () => { logout(); router.push('/admin/login'); };

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Sidebar */}
      <aside className={cn(
        'bg-forest-950 texture-organic transition-all duration-300 flex-shrink-0',
        sidebarOpen ? 'w-64' : 'w-20',
        'hidden md:flex md:flex-col h-screen sticky top-0'
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-500 px-2 py-0.5 bg-accent-500/10 rounded-full">ADMIN</span>
            <div className={cn('flex items-center gap-3 mt-1', !sidebarOpen && 'hidden')}>
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-heading font-bold text-white text-sm">PestShield Pro</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 flex-1">
          {adminMenuItems.map((item) => {
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
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10">
          {sidebarOpen && (
            <div className="bg-white/8 rounded-xl p-3 mb-3">
              <p className="text-white/70 text-xs font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-white/40 text-xs truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn('flex items-center gap-2 text-red-400 hover:text-red-300 text-sm w-full px-3 py-2 rounded-xl hover:bg-white/5 transition-colors', !sidebarOpen && 'justify-center')}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="bg-cream-50 border-b border-cream-300 px-6 py-4 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex p-2 rounded-xl hover:bg-cream-200 transition-colors text-neutral-600">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-bold text-ink">Admin Panel</h1>
        </header>
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
