
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icons } from './icons';
import Button from './ui/Button';
import Input from './ui/Input';
import ThemeToggleButton from './ThemeToggleButton';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

// UserMenu for Desktop
const UserMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
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
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-primary-dark rounded-md shadow-lg py-1 border dark:border-gray-700 z-10">
                    <Link to="/my-orders" onClick={() => setIsOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
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

// Mobile Menu Panel
const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { settings } = useData();
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            onClose();
        }
    };
    
    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
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
        onClose();
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div 
             className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark p-4 flex flex-col font-sans md:hidden"
             role="dialog"
             aria-modal="true"
        >
            <div className="flex justify-between items-center mb-8">
                <Link to="/" className="flex items-center gap-2" onClick={onClose}>
                    <Icons.Store className="h-6 w-6 text-primary-dark dark:text-white" />
                    <span className="font-bold text-lg text-primary-dark dark:text-white">{settings.shopName}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
                    <Icons.X className="h-6 w-6" />
                </Button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative mb-6">
                <Input
                    type="search"
                    placeholder="Search for products..."
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>

            <nav className="flex-1 flex flex-col justify-between mt-6">
                <div className="space-y-4 text-lg font-medium text-primary-dark dark:text-gray-200">
                    <Link to="/contact" onClick={onClose} className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        Contact
                    </Link>
                    <button onClick={handleWhatsAppInquiry} className="w-full text-left flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Icons.Whatsapp className="h-5 w-5 mr-3" />
                        Ask on WhatsApp
                    </button>
                </div>

                <div className="border-t dark:border-gray-700 pt-6 space-y-4">
                    {isAuthenticated && user ? (
                        <div className="space-y-2 text-lg font-medium">
                            <p className="px-2 font-semibold">Hi, {user.name.split(' ')[0]}</p>
                            <Link to="/my-orders" onClick={onClose} className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Icons.ListOrdered className="mr-3 h-5 w-5" />
                                My Orders
                            </Link>
                            <button onClick={handleLogout} className="w-full text-left flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-500">
                                <Icons.LogOut className="mr-3 h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Button asChild variant="accent" className="w-full text-lg h-12">
                            <Link to="/login" onClick={onClose}>
                                <Icons.LogIn className="mr-2 h-5 w-5" />
                                Login / Sign Up
                            </Link>
                        </Button>
                    )}
                </div>
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
    }

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-primary-dark dark:border-gray-800">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-2">
                        <Icons.Store className="h-6 w-6 text-primary-dark dark:text-white" />
                        <span className="font-bold text-lg text-primary-dark dark:text-white">{settings.shopName}</span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden flex-1 px-8 md:flex lg:px-20">
                        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg mx-auto">
                            <Input
                                type="search"
                                placeholder="Semantic Search for products..."
                                className="w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <ThemeToggleButton />
                        <Button asChild variant="ghost">
                           <Link to="/contact">Contact</Link>
                        </Button>
                        <Button variant="ghost" onClick={handleWhatsAppInquiry} size="sm">
                            <Icons.Whatsapp className="h-4 w-4 mr-2" />
                            Ask on WhatsApp
                        </Button>
                        {isAuthenticated ? (
                            <UserMenu />
                        ) : (
                             <Button asChild variant="ghost">
                                <Link to="/login">Login</Link>
                            </Button>
                        )}
                        <Button asChild variant="accent" size="sm" className="relative">
                            <Link to="/cart">
                                <Icons.ShoppingCart className="mr-2 h-4 w-4" />
                                My Cart
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </Button>
                    </div>

                     {/* Mobile Nav Toggle */}
                    <div className="flex items-center gap-1 md:hidden">
                        <ThemeToggleButton />
                        <Button asChild variant="ghost" size="icon" className="relative">
                            <Link to="/cart" aria-label="Open cart">
                                <Icons.ShoppingCart className="h-6 w-6" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
                            <Icons.Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </header>
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </>
    );
};

export default Header;
