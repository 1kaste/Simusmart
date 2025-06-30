

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';
import { useData } from '../src/contexts/DataContext';
import { Order } from '../data/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Icons } from '../components/icons';

const getStatusBadgeClasses = (status: Order['status']) => {
  const base = "px-3 py-1 text-xs font-medium rounded-full inline-block";
  switch (status) {
    case 'Pending':
      return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-300`;
    case 'Shipped':
      return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-300`;
    case 'Delivered':
      return `${base} bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-300`;
    case 'Cancelled':
      return `${base} bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-300`;
    default:
      return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
  }
};

export const MyOrdersPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const { orders } = useData();

    if (!isAuthenticated || !user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Icons.LogIn className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
                <h1 className="mt-6 text-3xl font-bold text-primary-dark dark:text-white">Access Denied</h1>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Please log in to view your order history.</p>
                <Button asChild size="lg" variant="accent" className="mt-8">
                    <Link to="/login">Login</Link>
                </Button>
            </div>
        );
    }
    
    // In a real app, you'd fetch orders by user ID. Here we filter by customer name.
    const myOrders = orders.filter(o => o.customerName === user.name);

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary-dark dark:text-white mb-8">My Orders</h1>
            {myOrders.length === 0 ? (
                 <div className="text-center py-20">
                    <Icons.Package className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
                    <h2 className="mt-6 text-2xl font-semibold text-primary-dark dark:text-white">No Orders Found</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
                    <Button asChild size="lg" variant="accent" className="mt-8">
                        <Link to="/">Start Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {myOrders.map(order => (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-row justify-between items-center">
                                <div>
                                    <CardTitle>Order #{order.id}</CardTitle>
                                    <CardDescription>Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                                </div>
                                <span className={getStatusBadgeClasses(order.status)}>{order.status}</span>
                            </CardHeader>
                            <CardContent>
                                <div className="border-t border-b dark:border-gray-700 py-4 my-4">
                                    <p><strong>Total:</strong> Ksh {order.total.toLocaleString()}</p>
                                    <p><strong>Items:</strong> {order.itemCount}</p>
                                    <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">This order will be delivered to: {order.customerAddress}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
