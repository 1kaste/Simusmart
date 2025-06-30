import React, { useEffect } from 'react';
import { Outlet, useLocation, NavLink, Link } from 'react-router-dom';
import { Icons } from '../../components/icons';
import ThemeToggleButton from '../../src/components/ThemeToggleButton';
import { useData } from '../../src/contexts/DataContext';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";
  const activeClasses = "bg-gray-900 text-white";

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </NavLink>
  );
};


const AdminLayout: React.FC = () => {
  const { settings } = useData();
  const location = useLocation();

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(p => p.length > 0 && p !== 'admin');
    const baseTitle = `${settings.shopName} - Admin`;
    if (pathParts.length === 0 || pathParts[0] === 'dashboard') {
        document.title = `Dashboard | ${baseTitle}`;
    } else {
        const pageName = pathParts[pathParts.length - 1];
        const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        document.title = `${formattedPageName} | ${baseTitle}`;
    }
  }, [location.pathname, settings.shopName]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-background-dark font-sans">
      <aside className="w-64 flex-shrink-0 bg-primary-dark text-white flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2 text-white">
            <Icons.Store className="h-6 w-6" />
            <span className="font-bold text-lg">{settings.shopName}</span>
          </Link>
          <ThemeToggleButton />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem to="/admin/dashboard" icon={<Icons.LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
          <NavItem to="/admin/inventory" icon={<Icons.Package className="h-5 w-5" />} label="Inventory" />
          <NavItem to="/admin/orders" icon={<Icons.ListOrdered className="h-5 w-5" />} label="Orders" />
          <NavItem to="/admin/settings" icon={<Icons.Settings className="h-5 w-5" />} label="Settings" />
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <Link to="/" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
             <Icons.LogOut className="h-5 w-5" />
             <span className="ml-3">Exit Admin</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;