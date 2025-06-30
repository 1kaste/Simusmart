import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icons } from './icons';
import Button from './ui/Button';
import Input from './ui/Input';
import ThemeToggleButton from './ThemeToggleButton';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

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
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-primary-dark rounded-md shadow-lg py-1 border dark:border-gray-700">
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


const Header: React.FC = () => {
    const { cartItems, cartCount } = useCart();
    const { isAuthenticated } = useAuth();
    const { settings } = useData();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

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
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-primary-dark/80 dark:border-gray-800">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2">
                    <Icons.Store className="h-6 w-6 text-primary-dark dark:text-white" />
                    <span className="font-bold text-lg text-primary-dark dark:text-white">{settings.shopName}</span>
                </Link>
                <div className="flex-1 px-8 lg:px-20">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Input
                            type="search"
                            placeholder="Semantic Search for products..."
                            className="w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggleButton />
                    <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary-dark dark:text-gray-300 dark:hover:text-white hidden md:block">
                        Contact
                    </Link>

                    <Button variant="ghost" onClick={handleWhatsAppInquiry} size="sm" className="hidden md:inline-flex">
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
            </div>
        </header>
    );
};

export default Header;