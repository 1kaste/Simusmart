import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Icons } from '../components/icons';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || `ORD${Math.floor(Math.random() * 90000) + 10000}`;
  
  useEffect(() => {
      // Clean up session storage after displaying the page
      sessionStorage.removeItem('order_placed');
  }, []);

  return (
    <div className="flex items-center justify-center flex-grow">
      <div className="text-center p-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <Icons.Package className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-primary-dark dark:text-white sm:text-5xl">
              Thank you for your order!
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400 mx-auto">
              Your order has been placed successfully. We've sent a confirmation to your email.
          </p>
          <div className="mt-6">
              <span className="font-semibold text-primary-dark dark:text-white">Order Number:</span>
              <span className="ml-2 font-mono text-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">{orderNumber}</span>
          </div>
          <Button asChild size="lg" variant="accent" className="mt-10">
              <Link to="/">Continue Shopping</Link>
          </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;