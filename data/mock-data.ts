
import { Icons } from '../components/icons';

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name:string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  itemCount: number;
  customerAddress: string;
  customerPhone: string;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid';
  paymentDetails?: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: keyof typeof Icons;
}

export interface QuickLink {
  id: string;
  text: string;
  url: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  details: string; 
  logoUrl: string;
}

export interface StoreSettings {
  shopName: string;
  logoUrl: string;
  contactEmail: string;
  location: string;
  socials: SocialLink[];
  quickLinks: QuickLink[];
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroTextColor: string;
  paymentMethods: PaymentMethod[];
  whatsappNumber: string;
}


export const CATEGORIES_DATA: Category[] = [
  { id: 'smartphones', name: 'Smartphones', imageUrl: 'https://picsum.photos/seed/smartphone/400/400' },
  { id: 'laptops', name: 'Laptops', imageUrl: 'https://picsum.photos/seed/laptop/400/400' },
  { id: 'watches', name: 'Watches', imageUrl: 'https://picsum.photos/seed/watch/400/400' },
  { id: 'audio', name: 'Audio', imageUrl: 'https://picsum.photos/seed/audio/400/400' },
  { id: 'cameras', name: 'Cameras', imageUrl: 'https://picsum.photos/seed/camera/400/400' },
  { id: 'accessories', name: 'Accessories', imageUrl: 'https://picsum.photos/seed/accessories/400/400' },
];

export let PRODUCTS_DATA: Product[] = [
  { id: 'prod1', name: 'AuraPhone X', price: 139999, imageUrl: 'https://picsum.photos/seed/phone1/400/600', category: 'Smartphones' },
  { id: 'prod2', name: 'Zenith Laptop Pro', price: 250000, imageUrl: 'https://picsum.photos/seed/laptop1/400/600', category: 'Laptops' },
  { id: 'prod3', name: 'ChronoWatch 2', price: 45000, imageUrl: 'https://picsum.photos/seed/watch1/400/600', category: 'Watches' },
  { id: 'prod4', name: 'EchoBuds Pro', price: 24999, imageUrl: 'https://picsum.photos/seed/audio1/400/600', category: 'Audio' },
  { id: 'prod5', name: 'VisionCam 4K', price: 89999, imageUrl: 'https://picsum.photos/seed/camera1/400/600', category: 'Cameras' },
  { id: 'prod6', name: 'PowerBank Ultra', price: 8900, imageUrl: 'https://picsum.photos/seed/acc1/400/600', category: 'Accessories' },
  { id: 'prod7', name: 'NovaPhone 12', price: 99999, imageUrl: 'https://picsum.photos/seed/phone2/400/600', category: 'Smartphones' },
  { id: 'prod8', name: 'AirBook Slim', price: 165000, imageUrl: 'https://picsum.photos/seed/laptop2/400/600', category: 'Laptops' },
];

export const ORDERS_DATA: Order[] = [
  { id: 'ORD001', customerName: 'Alice Johnson', date: '2024-05-20', status: 'Shipped', total: 148899, itemCount: 2, customerAddress: '456 Oginga Odinga St, Kisumu', customerPhone: '+254712345678', paymentMethod: 'Card', paymentStatus: 'Paid', paymentDetails: 'Paid via Card.' },
  { id: 'ORD002', customerName: 'Bob Williams', date: '2024-05-19', status: 'Delivered', total: 45000, itemCount: 1, customerAddress: '789 Moi Avenue, Mombasa', customerPhone: '+254722345678', paymentMethod: 'M-Pesa', paymentStatus: 'Paid', paymentDetails: 'RFE45KL98P Confirmed. Ksh45,000.00 sent to SimuSmart for order ORD002 on 19/05/2024.'},
  { id: 'ORD003', customerName: 'Charlie Brown', date: '2024-05-21', status: 'Pending', total: 8900, itemCount: 1, customerAddress: '101 Kimathi St, Nyeri', customerPhone: '+254733345678', paymentMethod: 'Payment on Delivery', paymentStatus: 'Unpaid' },
  { id: 'ORD004', customerName: 'Diana Miller', date: '2024-05-18', status: 'Delivered', total: 24999, itemCount: 1, customerAddress: '222 Kenyatta Ave, Nakuru', customerPhone: '+254744345678', paymentMethod: 'Card', paymentStatus: 'Paid', paymentDetails: 'Paid via Card.' },
  { id: 'ORD005', customerName: 'Ethan Davis', date: '2024-05-21', status: 'Pending', total: 389999, itemCount: 2, customerAddress: '333 Digo Rd, Malindi', customerPhone: '+254755345678', paymentMethod: 'M-Pesa', paymentStatus: 'Paid', paymentDetails: 'RGE99MN01X Confirmed. Ksh389,999.00 sent to SimuSmart for order ORD005 on 21/05/2024.' },
  { id: 'ORD006', customerName: 'Fiona Garcia', date: '2024-05-20', status: 'Cancelled', total: 99999, itemCount: 1, customerAddress: '444 Eldoret-Iten Rd, Eldoret', customerPhone: '+254766345678', paymentMethod: 'Card', paymentStatus: 'Paid' },
];

export const STORE_SETTINGS_DATA: StoreSettings = {
  shopName: 'SimuSmart',
  logoUrl: '/logo192.png',
  contactEmail: 'contact@simusmart.co.ke',
  location: '123 Biashara St, Nairobi, Kenya',
  whatsappNumber: '+254712345678',
  heroTitle: 'The Future of Smart Devices',
  heroSubtitle: 'Discover the latest in smart technology with unparalleled design and performance.',
  heroImageUrl: 'https://images.unsplash.com/photo-1512499617640-b74ae3a79d37?q=80&w=2560&auto=format&fit=crop',
  heroTextColor: '#FFFFFF',
  socials: [
    { id: 'soc1', name: 'Twitter', url: 'https://twitter.com/simusmart', icon: 'Twitter' },
    { id: 'soc2', name: 'Facebook', url: 'https://facebook.com/simusmart', icon: 'Facebook' },
    { id: 'soc3', name: 'Instagram', url: 'https://instagram.com/simusmart', icon: 'Instagram' },
  ],
  quickLinks: [
    { id: 'ql1', text: 'About Us', url: '#' },
    { id: 'ql2', text: 'FAQs', url: '#' },
    { id: 'ql3', text: 'Shipping Policy', url: '#' },
    { id: 'ql4', text: 'Terms of Service', url: '#' },
  ],
  paymentMethods: [
    { id: 'pay1', name: 'M-Pesa', details: 'Paybill: 555222', logoUrl: 'https://seeklogo.com/images/M/mpesa-logo-45EC29D379-seeklogo.com.png' },
    { id: 'pay2', name: 'Airtel Money', details: 'Till No: 123456', logoUrl: 'https://seeklogo.com/images/A/airtel-money-logo-9A7482A5A9-seeklogo.com.png' },
    { id: 'pay3', name: 'Visa', details: 'Card Payments', logoUrl: 'https://seeklogo.com/images/V/visa-logo-6F40596636-seeklogo.com.png' },
    { id: 'pay4', name: 'Payment on Delivery', details: 'Pay with cash upon arrival', logoUrl: 'https://i.ibb.co/GTPVcxq/cash-on-delivery.png' }
  ]
};
