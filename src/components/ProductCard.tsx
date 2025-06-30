
import React from 'react';
import { Product } from '../data/mock-data';
import { Card, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
    product: Product;
    className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
    const { addToCart } = useCart();

    return (
        <Card className={`overflow-hidden flex flex-col ${className}`}>
            <img src={product.imageUrl} alt={product.name} className="h-60 sm:h-72 w-full object-cover"/>
            <CardContent className="p-4 flex-grow">
                <h3 className="font-semibold text-lg text-primary-dark dark:text-white">{product.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{product.category}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 pt-0">
                <p className="font-bold text-lg sm:text-xl text-primary-dark dark:text-white">Ksh {product.price.toLocaleString()}</p>
                <Button size="sm" variant="accent" onClick={() => addToCart(product)}>Add</Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
