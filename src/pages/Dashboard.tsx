import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Users, Send, Settings, ChevronRight, BookOpen, LayoutDashboard, Github, ExternalLink } from 'lucide-react';

interface MenuItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  accent: string;
  onClick: (path: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, description, icon, path, accent, onClick }) => {
  return (
    <div
      className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-750 cursor-pointer transition-colors flex items-center gap-4 group"
      onClick={() => onClick(path)}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-700"
        style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.2), 0 0 20px ${accent}22`, color: accent }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      <span className="text-slate-600 group-hover:text-slate-400 transition-colors"><ChevronRight size={18} /></span>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Transactions',
      description: 'Créer, lister et gérer les transactions de paiement',
      icon: <CreditCard size={24} />,
      path: '/transactions',
      accent: '#3B82F6',
    },
    {
      title: 'Clients',
      description: 'Gérer les informations et profils des clients',
      icon: <Users size={24} />,
      path: '/customers',
      accent: '#8B5CF6',
    },
    {
      title: 'Transferts',
      description: 'Effectuer des transferts et payouts mobiles',
      icon: <Send size={24} />,
      path: '/payouts',
      accent: '#10B981',
    },
    {
      title: 'Configuration',
      description: 'Configurer les clés API et les paramètres',
      icon: <Settings size={24} />,
      path: '/setup',
      accent: '#F59E0B',
    },
  ];

  const resources = [
    {
      label: 'Documentation API HorusPay',
      url: 'https://docs.horuspay.com',
      color: '#3B82F6',
      icon: <BookOpen size={16} />,
    },
    {
      label: 'Dashboard HorusPay',
      url: 'https://dashboard.horuspay.com',
      color: '#8B5CF6',
      icon: <LayoutDashboard size={16} />,
    },
    {
      label: 'GitHub HorusPay',
      url: 'https://github.com/horuspay',
      color: '#10B981',
      icon: <Github size={16} />,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">HorusPay SDK — Test Interface</div>
        <h1 className="text-3xl font-bold text-white">HorusPay Testeur</h1>
        <p className="text-slate-400 mt-2">Interface de test complète pour le SDK HorusPay</p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <MenuItem key={item.path} {...item} onClick={navigate} />
        ))}
      </div>

      {/* Resources */}
      <section className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Ressources</p>
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-700">
          {resources.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <span style={{ color: r.color }}>
                {r.icon}
              </span>
              {r.label}
              <span className="ml-auto text-slate-600"><ExternalLink size={13} /></span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
