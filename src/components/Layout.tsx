import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Send,
  KeyRound,
  Webhook,
  Building2,
  Settings,
  ExternalLink,
  Hexagon,
} from 'lucide-react';
import { isHorusPayConfigured, getHorusPayConfig } from '../config/horuspay';

const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/transactions', icon: CreditCard, label: 'Transactions' },
      { to: '/customers', icon: Users, label: 'Customers' },
      { to: '/payouts', icon: Send, label: 'Payouts' },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { to: '/auth', icon: KeyRound, label: 'Auth' },
      { to: '/webhooks', icon: Webhook, label: 'Webhooks' },
      { to: '/account', icon: Building2, label: 'Accounts' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { to: '/setup', icon: Settings, label: 'Configuration' },
    ],
  },
];

const envBadgeClasses: Record<string, string> = {
  sandbox: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
  production: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  development: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
};

const envDotClasses: Record<string, string> = {
  sandbox: 'bg-yellow-400',
  production: 'bg-emerald-400',
  development: 'bg-blue-400',
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const configured = isHorusPayConfigured();
  const config = getHorusPayConfig();
  const env = config.environment;

  return (
    <div className="flex h-screen bg-[#0f172a]">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Hexagon size={16} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">HorusPay</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-[42px]">SDK Tester</p>
        </div>

        {/* Env badge */}
        {configured && (
          <div className={`mx-4 mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${envBadgeClasses[env] || envBadgeClasses.development}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${envDotClasses[env] || envDotClasses.development}`} />
            {env}
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {section.label}
              </span>
              <div className="mt-2 space-y-0.5">
                {section.items.map(({ to, icon: Icon, label }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600/15 text-indigo-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={17} className={isActive ? 'text-indigo-400' : ''} />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800 space-y-1.5">
          <span className="block text-[10px] text-slate-600">HorusPay SDK v1.0.0</span>
          <a
            href="https://docs.horuspay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-400 transition-colors"
          >
            Documentation <ExternalLink size={11} />
          </a>
        </div>
      </nav>

      {/* Main content */}
      <main className="ml-64 flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};
