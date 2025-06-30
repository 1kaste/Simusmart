
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Button from '../components/ui/Button';
import { Icons } from '../components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const CartPage: React.FC = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity, cartCount } = useCart();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-dark dark:text-white mb-8">
        Your Shopping Cart
      </h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <Icons.ShoppingCart className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
          <h2 className="mt-6 text-2xl font-semibold text-primary-dark dark:text-white">Your cart is empty</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild size="lg" variant="accent" className="mt-8">
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.product.id} className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-md" />
                    <div className="flex-grow mt-4 sm:mt-0 sm:ml-4">
                      <h3 className="font-semibold text-lg text-primary-dark dark:text-white">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ksh {item.product.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4">
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</Button>
                      <span className="w-10 text-center font-semibold text-lg">{item.quantity}</span>
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</Button>
                    </div>
                    <div className="font-bold text-lg text-primary-dark dark:text-white mt-4 sm:mt-0 sm:ml-6 text-right sm:text-left w-full sm:w-auto">
                      Ksh {(item.product.price * item.quantity).toLocaleString()}
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4 self-end sm:self-center">
                      <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.product.id)}>
                        <Icons.Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>Ksh {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="flex justify-between font-bold text-xl text-primary-dark dark:text-white">
                  <span>Total</span>
                  <span>Ksh {totalPrice.toLocaleString()}</span>
                </div>
                <Button asChild size="lg" variant="accent" className="w-full mt-4">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
