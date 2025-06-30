import React, { useState, useMemo, useEffect } from 'react';
import { Order, StoreSettings } from '../../data/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Icons } from '../../components/icons';
import Modal from '../../src/components/ui/Modal';
import { useData } from '../../src/contexts/DataContext';

const getStatusSelectClasses = (status: Order['status']) => {
  const base = "p-1.5 rounded-md border text-sm focus:ring-accent-teal focus:border-accent-teal font-medium transition-colors";
  switch (status) {
    case 'Pending':
      return `${base} bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-500/10 dark:border-yellow-500/20 dark:text-yellow-400`;
    case 'Shipped':
      return `${base} bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400`;
    case 'Delivered':
      return `${base} bg-green-100 border-green-200 text-green-800 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400`;
    case 'Cancelled':
      return `${base} bg-red-100 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400`;
    default:
      return `${base} bg-white dark:bg-gray-900/50 border-gray-300 dark:border-gray-600`;
  }
};

const OrderShareModal: React.FC<{ order: Order, onClose: () => void, settings: StoreSettings }> = ({ order, onClose, settings }) => {
    
    const [clientMessage, setClientMessage] = useState('');
    
    useEffect(() => {
        const paymentInfo = order.paymentStatus === 'Paid'
            ? `Your payment of Ksh ${order.total.toLocaleString()} via ${order.paymentMethod} is confirmed.`
            : `Your order total is Ksh ${order.total.toLocaleString()}, to be paid upon delivery.`;

        let message = '';
        switch(order.status) {
            case 'Pending':
                message = `Hi ${order.customerName}, your ${settings.shopName} order #${order.id} has been received and is being processed. ${paymentInfo}`;
                break;
            case 'Shipped':
                message = `Hi ${order.customerName}, your ${settings.shopName} order #${order.id} has been shipped! ${paymentInfo} You can track it here: https://simusmart.example.com/track/${order.id}`;
                break;
            case 'Delivered':
                message = `Hi ${order.customerName}, your ${settings.shopName} order #${order.id} has been delivered. We hope you enjoy your purchase! Thank you for shopping with ${settings.shopName}.`;
                break;
            case 'Cancelled':
                message = `Hi ${order.customerName}, regarding your ${settings.shopName} order #${order.id}, it has now been cancelled as per your request or store policy. Please contact us if you have any questions.`;
                break;
        }
        setClientMessage(message);

    }, [order, settings]);


    const riderMessageDefault = useMemo(() => {
        const paymentInstruction = order.paymentStatus === 'Unpaid'
            ? `COLLECT: Ksh ${order.total.toLocaleString()} CASH.`
            : `PAID via ${order.paymentMethod}. No collection needed.`;
            
        return `DISPATCH\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nAddress: ${order.customerAddress}\nPhone: ${order.customerPhone}\nItems: ${order.itemCount}\n\n**${paymentInstruction}**`;
    }, [order]);

    const [riderMessage, setRiderMessage] = useState(riderMessageDefault);
    
    const handleSend = (message: string) => {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary-dark dark:text-white">Share Order #{order.id} ({order.status})</h2>
            
            <div className="space-y-2">
                <label className="font-semibold text-gray-800 dark:text-gray-300">Message for Client</label>
                <textarea 
                    rows={5} 
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal dark:bg-gray-900/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                />
                <Button onClick={() => handleSend(clientMessage)} className="w-full" variant="accent">
                    <Icons.Whatsapp className="mr-2 h-4 w-4" />
                    Send to Client via WhatsApp
                </Button>
            </div>

            <div className="space-y-2">
                <label className="font-semibold text-gray-800 dark:text-gray-300">Dispatch Details for Rider</label>
                 <textarea 
                    rows={7} 
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal dark:bg-gray-900/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    value={riderMessage}
                    onChange={(e) => setRiderMessage(e.target.value)}
                />
                <Button onClick={() => handleSend(riderMessage)} className="w-full">
                     <Icons.Whatsapp className="mr-2 h-4 w-4" />
                    Send to Rider via WhatsApp
                </Button>
            </div>

             <div className="flex justify-end pt-2">
                <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
        </div>
    );
};

const OrderDetailsModal: React.FC<{ order: Order, onClose: () => void }> = ({ order, onClose }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary-dark dark:text-white">Order Details: {order.id}</h2>
      <div className="space-y-2 text-sm">
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Phone:</strong> {order.customerPhone}</p>
        <p><strong>Address:</strong> {order.customerAddress}</p>
        <p><strong>Total:</strong> Ksh {order.total.toLocaleString()} ({order.itemCount} items)</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
      </div>
      {order.paymentDetails && (
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-300 mt-4">Payment Confirmation Details</h3>
          <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
            {order.paymentDetails}
          </pre>
        </div>
      )}
      <div className="flex justify-end pt-4">
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};


const OrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, settings } = useData();
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const openShareModal = (order: Order) => {
      setSelectedOrder(order);
      setShareModalOpen(true);
  };
  
  const openDetailsModal = (order: Order) => {
      setSelectedOrder(order);
      setDetailsModalOpen(true);
  };

  const closeModal = () => {
      setShareModalOpen(false);
      setDetailsModalOpen(false);
      setSelectedOrder(null);
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary-dark dark:text-white">Order Tracking</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Order ID</th>
                    <th scope="col" className="px-6 py-3">Customer</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Payment</th>
                    <th scope="col" className="px-6 py-3">Total</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="bg-white border-b dark:bg-primary-dark dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{order.id}</td>
                      <td className="px-6 py-4">{order.customerName}</td>
                      <td className="px-6 py-4">{order.date}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                          className={getStatusSelectClasses(order.status)}
                        >
                          <option value="Pending" className="bg-white dark:bg-primary-dark text-yellow-800 dark:text-yellow-400">Pending</option>
                          <option value="Shipped" className="bg-white dark:bg-primary-dark text-blue-800 dark:text-blue-400">Shipped</option>
                          <option value="Delivered" className="bg-white dark:bg-primary-dark text-green-800 dark:text-green-400">Delivered</option>
                          <option value="Cancelled" className="bg-white dark:bg-primary-dark text-red-800 dark:text-red-400">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/80 dark:text-orange-300'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">Ksh {order.total.toLocaleString()}</td>
                      <td className="px-6 py-4 flex items-center space-x-1">
                          <Button variant="outline" size="sm" onClick={() => openDetailsModal(order)}>
                            Details
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openShareModal(order)}>
                            <Icons.Whatsapp className="h-4 w-4" />
                          </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {isDetailsModalOpen && selectedOrder && (
          <Modal isOpen={isDetailsModalOpen} onClose={closeModal}>
              <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
          </Modal>
      )}

      {isShareModalOpen && selectedOrder && (
          <Modal isOpen={isShareModalOpen} onClose={closeModal}>
              <OrderShareModal order={selectedOrder} onClose={closeModal} settings={settings} />
          </Modal>
      )}
    </>
  );
};

export default OrdersPage;