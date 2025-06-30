
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icons } from './icons';
import Button from './ui/Button';
import Input from './ui/Input';
import ThemeToggleButton from './ThemeToggleButton';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const UserMenu: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        if (onLinkClick) onLinkClick();
        navigate('/');
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
                Hi, {user.name.split(' ')[0]}
            </Button>
            {isOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-primary-dark rounded-md shadow-lg py-1 border dark:border-gray-700">
                    <Link to="/my-orders" onClick={() => { setIsOpen(false); if (onLinkClick) onLinkClick(); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Icons.ListOrdered className="mr-2 h-4 w-4" />
                        My Orders
                    </Link>
                    <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Icons.LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; settings: any }> = ({ isOpen, onClose, children, settings }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark md:hidden" role="dialog" aria-modal="true">
            <div className="flex justify-between items-center h-16 px-4 border-b dark:border-gray-800">
                 <Link to="/" className="flex items-center gap-3" onClick={onClose}>
                    {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt={`${settings.shopName} logo`} className="h-9 w-auto" />
                    ) : (
                        <Icons.Store className="h-6 w-6 text-primary-dark dark:text-white" />
                    )}
                    <span className="font-bold text-lg text-primary-dark dark:text-white">{settings.shopName}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
                    <Icons.X className="h-6 w-6" />
                </Button>
            </div>
            <nav className="flex flex-col p-4 space-y-4">
                {children}
            </nav>
        </div>
    );
};

const Header: React.FC = () => {
    const { cartItems, cartCount } = useCart();
    const { isAuthenticated } = useAuth();
    const { settings } = useData();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
            setSearchQuery('');
        }
    };

    const handleWhatsAppInquiry = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty. Add some products to inquire about them.");
            return;
        }
        const productLines = cartItems.map(item => `- ${item.product.name} (Quantity: ${item.quantity})`).join('\n');
        const message = `Hello ${settings.shopName}! I'm interested in the following products:\n\n${productLines}\n\nCould you please provide more information?`;
        
        const phoneNumber = settings.whatsappNumber.replace(/\D/g, '');
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
        setMobileMenuOpen(false);
    }

    const navLinks = (
        <>
            <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs lg:max-w-sm">
                <Input
                    type="search"
                    placeholder="Semantic Search for products..."
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-primary-dark dark:text-gray-300 dark:hover:text-white">
                Contact
            </Link>
            <Button variant="ghost" onClick={handleWhatsAppInquiry} size="sm">
                <Icons.Whatsapp className="h-4 w-4 mr-2" />
                Ask on WhatsApp
            </Button>
            {isAuthenticated ? (
                <UserMenu onLinkClick={() => setMobileMenuOpen(false)} />
            ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-primary-dark dark:text-gray-300 dark:hover:text-white">
                    Login
                </Link>
            )}
        </>
    );

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-primary-dark/80 dark:border-gray-800">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3">
                    {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt={`${settings.shopName} logo`} className="h-9 w-auto" />
                    ) : (
                        <Icons.Store className="h-6 w-6 text-primary-dark dark:text-white" />
                    )}
                    <span className="font-bold text-lg text-primary-dark dark:text-white hidden sm:inline-block">{settings.shopName}</span>
                </Link>

                {/* Desktop Search & Nav */}
                <div className="hidden md:flex flex-1 justify-center items-center px-8 lg:px-20">
                    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
                        <Input
                            type="search"
                            placeholder="Semantic Search for products..."
                            className="w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
                
                <div className="flex items-center gap-1 md:gap-2">
                    <ThemeToggleButton />
                    <div className="hidden md:flex items-center gap-1 md:gap-2">
                        <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary-dark dark:text-gray-300 dark:hover:text-white">
                            Contact
                        </Link>
                         <Button variant="ghost" onClick={handleWhatsAppInquiry} size="sm" className="hidden lg:inline-flex">
                            <Icons.Whatsapp className="h-4 w-4 mr-2" />
                            Ask on WhatsApp
                        </Button>
                         {isAuthenticated ? (
                            <UserMenu />
                        ) : (
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-dark dark:text-gray-300 dark:hover:text-white">
                                Login
                            </Link>
                        )}
                    </div>
                    <Button asChild variant="accent" size="sm" className="relative ml-2">
                        <Link to="/cart">
                            <Icons.ShoppingCart className="md:mr-2 h-4 w-4" />
                            <span className="hidden md:inline">My Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </Button>
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
                            <Icons.Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} settings={settings}>
                {navLinks}
            </MobileMenu>
        </header>
    );
};

export default Header;
