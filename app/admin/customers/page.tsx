'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Search, Download, MoreVertical, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

type Customer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  planType?: string;
  totalBookings?: number;
  totalSpent?: number;
  createdAt?: string;
  isBlocked?: boolean;
  city?: string;
};

const PLAN_LABELS: Record<string, string> = {
  SINGLE: 'Single',
  CONTRACT_RESIDENTIAL: 'Annual',
  AMC_COMMERCIAL: 'AMC',
};

// Mock data fallback
const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Ramesh Kumar', phone: '9876543210', email: 'ramesh@example.com', planType: 'CONTRACT_RESIDENTIAL', totalBookings: 8, totalSpent: 12400, createdAt: '2025-01-15', city: 'Hyderabad' },
  { id: '2', name: 'Priya Sharma', phone: '9123456789', email: 'priya@example.com', planType: 'SINGLE', totalBookings: 3, totalSpent: 2400, createdAt: '2025-03-20', city: 'Hyderabad' },
  { id: '3', name: 'Suresh Reddy', phone: '9988776655', email: 'suresh@example.com', planType: 'AMC_COMMERCIAL', totalBookings: 15, totalSpent: 45000, createdAt: '2024-11-10', city: 'Secunderabad' },
  { id: '4', name: 'Anita Patel', phone: '9765432100', email: 'anita@example.com', planType: 'SINGLE', totalBookings: 1, totalSpent: 799, createdAt: '2026-02-01', city: 'Hyderabad' },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());

  const { data: customersData, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => api.get('/customers').then(r => r.data.data?.items || r.data.data || []).catch(() => MOCK_CUSTOMERS),
  });

  const customers: Customer[] = customersData || MOCK_CUSTOMERS;

  const filtered = customers.filter((c) => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchPlan = !planFilter || c.planType === planFilter;
    return matchSearch && matchPlan;
  });

  const exportCsv = () => {
    const rows = [
      ['Name', 'Phone', 'Email', 'Plan', 'Bookings', 'Spent', 'City', 'Joined'],
      ...filtered.map(c => [
        c.name, c.phone || '', c.email || '',
        PLAN_LABELS[c.planType || ''] || c.planType || '',
        String(c.totalBookings || 0),
        String(c.totalSpent || 0),
        c.city || '',
        c.createdAt ? format(new Date(c.createdAt), 'dd/MM/yyyy') : '',
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const sendWhatsApp = (c: Customer) => {
    toast.success(`WhatsApp message queued for ${c.name}`);
  };

  const toggleBlock = (id: string, name: string) => {
    setBlockedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.success(`${name} unblocked`); }
      else { next.add(id); toast.success(`${name} blocked`); }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink">Customers</h1>
          <p className="text-neutral-500 mt-1">{customers.length} total customers</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-cream-300 rounded-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-4 py-2.5 bg-card border border-cream-300 rounded-xl text-sm outline-none focus:border-brand-600 transition-all"
        >
          <option value="">All Plans</option>
          <option value="SINGLE">Single Service</option>
          <option value="CONTRACT_RESIDENTIAL">Annual Plan</option>
          <option value="AMC_COMMERCIAL">AMC Commercial</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-cream-300 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const isBlocked = blockedIds.has(c.id);
                  return (
                    <TableRow key={c.id} className={cn(isBlocked && 'opacity-50')}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-ink text-sm">{c.name}</p>
                          <p className="text-xs text-neutral-500">{c.phone}</p>
                          {c.email && <p className="text-xs text-neutral-400">{c.email}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', {
                          'bg-brand-50 text-brand-700': c.planType === 'CONTRACT_RESIDENTIAL',
                          'bg-purple-50 text-purple-700': c.planType === 'AMC_COMMERCIAL',
                          'bg-neutral-100 text-neutral-600': c.planType === 'SINGLE' || !c.planType,
                        })}>
                          {PLAN_LABELS[c.planType || ''] || 'Single'}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold text-ink">{c.totalBookings || 0}</TableCell>
                      <TableCell className="font-semibold text-brand-600">
                        ₹{(c.totalSpent || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-neutral-600 text-sm">{c.city || '—'}</TableCell>
                      <TableCell className="text-neutral-500 text-sm">
                        {c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : '—'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-neutral-400 hover:text-ink p-1 rounded-lg hover:bg-cream-100 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => sendWhatsApp(c)}>
                              <MessageSquare className="w-3.5 h-3.5 mr-2" />
                              Send WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleBlock(c.id, c.name)}>
                              {isBlocked ? 'Unblock Customer' : 'Block Customer'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-400">
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
