
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, NavLink, Link } from 'react-router-dom';
import { Icons } from '../../components/icons';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/ui/Button';

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
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = () => {
    const pathParts = location.pathname.split('/').filter(p => p.length > 0 && p !== 'admin');
    if (pathParts.length === 0 || pathParts[0] === 'dashboard') {
        return 'Dashboard';
    }
    const pageName = pathParts[pathParts.length - 1];
    return pageName.charAt(0).toUpperCase() + pageName.slice(1);
  };

  useEffect(() => {
    document.title = `${getPageTitle()} | ${settings.shopName} Admin`;
  }, [location.pathname, settings.shopName]);
  
  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-background-dark font-sans">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 flex-shrink-0 bg-primary-dark text-white flex flex-col z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-3 text-white">
            {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={`${settings.shopName} logo`} className="h-8 w-auto bg-white rounded-sm p-1" />
            ) : (
                <Icons.Store className="h-6 w-6" />
            )}
            <span className="font-bold text-lg">{settings.shopName}</span>
          </Link>
          <div className="lg:hidden">
            <ThemeToggleButton />
          </div>
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

      <div className="flex-1 flex flex-col w-full lg:w-auto">
         <header className="lg:hidden h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-primary-dark border-b dark:border-gray-800">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Icons.Menu className="h-6 w-6 text-primary-dark dark:text-white" />
            </Button>
            <h1 className="text-lg font-semibold text-primary-dark dark:text-white">{getPageTitle()}</h1>
             <div className="hidden lg:block">
                <ThemeToggleButton />
            </div>
         </header>
         <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <Outlet />
         </main>
      </div>
    </div>
  );
};

export default AdminLayout;
