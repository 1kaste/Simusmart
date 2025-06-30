import React from 'react';
import { Icons } from './icons';
import { useData } from '../src/contexts/DataContext';

const WhatsAppButton: React.FC = () => {
    const { settings } = useData();

    if (!settings.whatsappNumber) {
        return null;
    }

    // Basic cleaning of phone number
    const phoneNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappLink = `https://wa.me/${phoneNumber}`;
    
    return (
        <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50"
            aria-label="Contact us on WhatsApp"
        >
            <Icons.Whatsapp className="h-8 w-8 text-white" />
        </a>
    );
};

export default WhatsAppButton;