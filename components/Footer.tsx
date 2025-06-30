import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from './icons';
import { useData } from '../src/contexts/DataContext';

const Footer: React.FC = () => {
    const { settings } = useData();

    return (
        <footer className="bg-primary-dark text-white">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 px-4 py-12 sm:px-6 lg:px-8">
                {/* About Section */}
                <div className="space-y-4 lg:col-span-2">
                    <div className="flex items-center gap-2">
                        <Icons.Store className="h-7 w-7" />
                        <span className="font-bold text-xl">{settings.shopName}</span>
                    </div>
                    <p className="text-sm text-gray-400">The best place to find the latest and greatest in smart technology. Your future, delivered.</p>
                     <Link to="/admin/login" className="text-sm font-medium text-gray-300 hover:text-white pt-4 inline-block">
                        Shop Owner Login
                    </Link>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        {settings.quickLinks.map(link => (
                            <li key={link.id}>
                                <a href={link.url} className="text-gray-400 hover:text-white text-sm">{link.text}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Contact Us */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start">
                            <Icons.MapPin className="h-5 w-5 mr-3 mt-0.5 text-accent-teal" />
                            <span className="text-gray-400">{settings.location}</span>
                        </li>
                        <li className="flex items-start">
                             <Icons.Mail className="h-5 w-5 mr-3 mt-0.5 text-accent-teal" />
                             <a href={`mailto:${settings.contactEmail}`} className="text-gray-400 hover:text-white">{settings.contactEmail}</a>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                     <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                     <div className="flex items-center space-x-4">
                        {settings.socials.map(social => {
                            const IconComponent = Icons[social.icon];
                            return (
                                <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                                    <IconComponent className="h-6 w-6" />
                                </a>
                            )
                        })}
                    </div>
                </div>
            </div>
            
            {settings.paymentMethods && settings.paymentMethods.length > 0 && (
                 <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <h3 className="font-semibold text-md">We Accept:</h3>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {settings.paymentMethods.map(method => (
                                <div key={method.id} className="bg-white p-1 rounded-md">
                                    <img src={method.logoUrl} alt={method.name} className="h-8 object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            )}

            <div className="bg-black/20">
                <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} {settings.shopName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;