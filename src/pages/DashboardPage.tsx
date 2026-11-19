import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  FolderKanban,
  CreditCard,
  Receipt,
  History,
  Settings,
  LifeBuoy,
  ArrowUpRight,
  LogOut,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Button, SurfaceCard } from '../components/ui';

interface AuthUser {
  id: string;
  provider: string;
  name: string;
  email: string;
  avatar?: string | null;
}

const MENU = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'My Products', icon: Box },
  { id: 'projects', label: 'My Projects', icon: FolderKanban },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'billing', label: 'Billing', icon: Receipt },
  { id: 'history', label: 'Purchase History', icon: History },
  { id: 'settings', label: 'Account Settings', icon: Settings },
  { id: 'support', label: 'Help & Support', icon: LifeBuoy },
] as const;

type MenuId = (typeof MENU)[number]['id'];

export function DashboardPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<MenuId>('overview');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-3 rounded-2xl bg-[#171717] border border-[#242424] p-4 space-y-2 lg:sticky lg:top-24">
          <div className="px-3 py-2 border-b border-[#242424] mb-2 space-y-1">
            <p className="text-[11px] font-mono text-[#FF3030] uppercase">
              {user ? `OAUTH // ${user.provider}` : 'WORKSPACE PREVIEW'}
            </p>
            <p className="text-sm font-bold text-white truncate">
              {user ? user.name : 'Jevallene User Portal'}
            </p>
            {user && <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>}
          </div>
          <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1">
            {MENU.map((item) => {
              const active = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer text-left ${
                    active
                      ? 'bg-[#FF3030] text-white shadow-[0_0_16px_rgba(255,48,48,0.3)]'
                      : 'text-neutral-300 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full mt-2 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-neutral-300 hover:text-[#FF3030] hover:bg-white/[0.04] border border-transparent hover:border-[#FF3030]/40 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Keluar (Logout)</span>
            </button>
          )}
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-9 space-y-6">
          <SurfaceCard className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-[#FF3030] uppercase">
                {MENU.find((m) => m.id === activeMenu)?.label}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {activeMenu === 'overview' && 'Selamat Datang di Ekosistem Jevallene'}
                {activeMenu === 'products' && 'Produk Digital Tersedia'}
                {activeMenu === 'projects' && 'Proyek & Kolaborasi'}
                {activeMenu === 'subscription' && 'Paket Langganan'}
                {activeMenu === 'billing' && 'Informasi Tagihan'}
                {activeMenu === 'history' && 'Riwayat Transaksi'}
                {activeMenu === 'settings' && 'Pengaturan Akun'}
                {activeMenu === 'support' && 'Bantuan & Dukungan'}
              </h1>
            </div>
            <Link to="/products">
              <Button size="sm">Buka Katalog Produk</Button>
            </Link>
          </SurfaceCard>

          {(activeMenu === 'overview' || activeMenu === 'products') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PRODUCTS.map((p) => (
                <SurfaceCard key={p.id} className="p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#FF3030] uppercase">
                      {p.categoryLabel}
                    </span>
                    <h2 className="text-lg font-bold text-white">{p.name}</h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">{p.summary}</p>
                  </div>
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#FF3030]"
                  >
                    <span>Launch Product</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </SurfaceCard>
              ))}
            </div>
          )}

          {activeMenu !== 'overview' && activeMenu !== 'products' && (
            <SurfaceCard className="p-8 space-y-4">
              <p className="text-sm text-neutral-300 leading-relaxed">
                Modul <strong>{MENU.find((m) => m.id === activeMenu)?.label}</strong> disiapkan
                untuk fase akun pengguna berikutnya. Untuk kebutuhan proyek atau bantuan langsung,
                silakan gunakan halaman Contact.
              </p>
              <Link to="/contact">
                <Button variant="outline" size="sm">
                  Hubungi Tim Jevallene
                </Button>
              </Link>
            </SurfaceCard>
          )}
        </section>
      </div>
    </div>
  );
}
