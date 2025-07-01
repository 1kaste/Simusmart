
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../src/contexts/CartContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useData } from '../src/contexts/DataContext';
import { Order, PaymentMethod } from '../data/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { useAuth } from '../src/contexts/AuthContext';
import { Icons } from '../components/icons';

const VisaForm = () => {
    return (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mt-2 space-y-4 bg-gray-50 dark:bg-gray-800/50">
             <div className="space-y-2">
                <label htmlFor="cardName" className="text-sm font-medium">Name on Card</label>
                <Input name="cardName" id="cardName" placeholder="John M. Doe" required />
            </div>
            <div className="space-y-2">
                <label htmlFor="cardNumber" className="text-sm font-medium">Card Number</label>
                <Input name="cardNumber" id="cardNumber" placeholder="0000 0000 0000 0000" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label htmlFor="cardExpiry" className="text-sm font-medium">Expiry</label>
                    <Input name="cardExpiry" id="cardExpiry" placeholder="MM/YY" required />
                </div>
                 <div className="space-y-2">
                    <label htmlFor="cardCvc" className="text-sm font-medium">CVC</label>
                    <Input name="cardCvc" id="cardCvc" placeholder="123" required />
                </div>
            </div>
        </div>
    );
};

const MobileMoneyForm: React.FC<{ method: PaymentMethod, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = ({ method, value, onChange }) => {
    return (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mt-2 space-y-2 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-sm">After paying using {method.name} ({method.details}), please paste the confirmation message you receive below.</p>
            <textarea
                name="paymentDetails"
                rows={4}
                value={value}
                onChange={onChange}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal dark:bg-gray-900/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="e.g., QWERTY12345 Confirmed. Ksh..."
                required
            />
        </div>
    );
};

const CheckoutPage: React.FC = () => {
  const { cartItems, totalPrice, clearCart, cartCount } = useCart();
  const { settings, addOrder } = useData();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(settings.paymentMethods[0]?.id || null);
  const [paymentMessage, setPaymentMessage] = useState('');
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    if (user) {
        const nameParts = user.name.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (cartCount === 0 && !sessionStorage.getItem('order_placed')) {
      navigate('/cart');
    }
  }, [cartCount, navigate]);


  const handleGuestCheckout = () => {
    if (!settings.whatsappNumber || cartItems.length === 0) {
        alert("Could not create order. WhatsApp number is not set or cart is empty.");
        return;
    }

    const productLines = cartItems.map(item => 
        `- ${item.product.name}${item.color ? ` (${item.color})` : ''} (Qty: ${item.quantity}) - Ksh ${(item.product.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const message = `Hello ${settings.shopName}!\n\nI would like to place an order for the following items:\n\n${productLines}\n\n*Total: Ksh ${totalPrice.toLocaleString()}*\n\nPlease advise on payment and delivery. Thank you.`;
    
    const phoneNumber = settings.whatsappNumber.replace(/\D/g, '');
    
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappLink, '_blank');
    
    clearCart();
    alert("You've been redirected to WhatsApp to complete your order. Your cart has now been cleared.");
    navigate('/');
  };


  const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const customerName = `${firstName} ${lastName}`;
    const selectedMethod = settings.paymentMethods.find(p => p.id === selectedPaymentMethodId);
    
    let detailsForOrder = '';
    if (selectedMethod?.name === 'Visa') {
        detailsForOrder = 'Paid via Card.';
    } else if (selectedMethod?.name.includes('Delivery')) {
        detailsForOrder = 'To be paid on delivery.';
    } else {
        detailsForOrder = paymentMessage;
    }

    const newOrder: Order = {
        id: `ORD${Math.floor(Math.random() * 90000) + 10000}`,
        customerName: customerName,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        status: 'Pending',
        total: totalPrice,
        itemCount: cartCount,
        items: cartItems,
        customerAddress: `${address}, ${city}`,
        customerPhone: phone,
        paymentMethod: selectedMethod?.name || 'Unknown',
        paymentStatus: selectedMethod?.name === 'Payment on Delivery' ? 'Unpaid' : 'Paid',
        paymentDetails: detailsForOrder
    };

    addOrder(newOrder);
    clearCart();
    sessionStorage.setItem('order_placed', 'true'); // Avoid redirect loop
    navigate('/order-confirmation', { state: { orderNumber: newOrder.id }});
  };

  if (cartCount === 0) {
    return null; // Don't render if cart is empty, effect will redirect
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
              <CardHeader>
                  <CardTitle>Complete Your Order via WhatsApp</CardTitle>
                  <CardDescription>
                      As a guest, you can quickly place your order by sending your cart to us on WhatsApp. We'll confirm the details and delivery with you there.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <h3 className="font-semibold mb-2 text-primary-dark dark:text-white">Your Cart Summary</h3>
                  <div className="space-y-2 border-t border-b dark:border-gray-700 py-4 my-2 max-h-64 overflow-y-auto">
                      {cartItems.map(item => (
                          <div key={`${item.product.id}-${item.color}`} className="flex justify-between items-center text-sm">
                              <p>{item.product.name} {item.color ? `(${item.color})` : ''} <span className="text-gray-500 dark:text-gray-400">x {item.quantity}</span></p>
                              <p className="font-medium">Ksh {(item.product.price * item.quantity).toLocaleString()}</p>
                          </div>
                      ))}
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 text-primary-dark dark:text-white">
                      <span>Total</span>
                      <span>Ksh {totalPrice.toLocaleString()}</span>
                  </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                    <Button onClick={handleGuestCheckout} size="lg" variant="accent" className="w-full">
                      <Icons.Whatsapp className="mr-2 h-5 w-5" />
                      Confirm Order on WhatsApp
                  </Button>
                    <Link to="/login?redirect=/checkout" className="text-sm text-accent-teal hover:underline">
                      Login to save your details for next time
                    </Link>
              </CardFooter>
          </Card>
      </div>
    );
  }

  const selectedMethodInfo = settings.paymentMethods.find(p => p.id === selectedPaymentMethodId);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-primary-dark dark:text-white mb-8 text-center">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Shipping Details */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader><CardTitle>Shipping Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><label htmlFor="firstName">First Name</label><Input value={firstName} onChange={e => setFirstName(e.target.value)} name="firstName" id="firstName" required /></div>
                <div className="space-y-2"><label htmlFor="lastName">Last Name</label><Input value={lastName} onChange={e => setLastName(e.target.value)} name="lastName" id="lastName" required /></div>
              </div>
              <div className="space-y-2"><label htmlFor="address">Address</label><Input value={address} onChange={e => setAddress(e.target.value)} name="address" id="address" required /></div>
              <div className="space-y-2"><label htmlFor="city">City</label><Input value={city} onChange={e => setCity(e.target.value)} name="city" id="city" required /></div>
              <div className="space-y-2"><label htmlFor="phone">Phone Number</label><Input value={phone} onChange={e => setPhone(e.target.value)} name="phone" id="phone" type="tel" required /></div>
              <div className="space-y-2"><label htmlFor="email">Email</label><Input value={email} onChange={e => setEmail(e.target.value)} name="email" id="email" type="email" required /></div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="mt-8">
            <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {settings.paymentMethods.map((method) => (
                <div key={method.id}>
                  <label htmlFor={method.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethodId === method.id ? 'border-accent-teal ring-2 ring-accent-teal' : 'border-gray-300 dark:border-gray-600'}`}>
                    <input
                      type="radio"
                      id={method.id}
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethodId === method.id}
                      onChange={() => setSelectedPaymentMethodId(method.id)}
                      className="h-4 w-4 text-accent-teal focus:ring-accent-teal"
                    />
                    <img src={method.logoUrl} alt={method.name} className="h-8 w-16 object-contain ml-4 bg-white p-1 rounded-sm" />
                    <div className="ml-4 flex-grow">
                      <p className="font-semibold">{method.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{method.details}</p>
                    </div>
                  </label>
                  {selectedPaymentMethodId === method.id && method.name === 'Visa' && <VisaForm />}
                  {selectedPaymentMethodId === method.id && (method.name === 'M-Pesa' || method.name === 'Airtel Money') && (
                      <MobileMoneyForm method={method} value={paymentMessage} onChange={(e) => setPaymentMessage(e.target.value)} />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={`${item.product.id}-${item.color}`} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" />
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.color ? `${item.color}, ` : ''}Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">Ksh {(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t my-4"></div>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>Ksh {totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
                <div className="flex justify-between font-bold text-xl pt-2"><span>Total</span><span>Ksh {totalPrice.toLocaleString()}</span></div>
              </div>
              <Button type="submit" size="lg" variant="accent" className="w-full mt-6" disabled={!selectedPaymentMethodId}>
                Place Order
              </Button>
               <div className="text-center mt-4">
                <Link to="/cart" className="text-sm text-accent-teal hover:underline">
                  &larr; Back to Cart
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
