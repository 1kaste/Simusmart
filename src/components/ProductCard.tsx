
import React, { useState } from 'react';
import { marked } from 'marked';
import { Product } from '../data/mock-data';
import { Card, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { useCart } from '../src/contexts/CartContext';
import Modal from '../src/components/ui/Modal';
import { Icons } from './icons';

interface ProductCardProps {
    product: Product;
    className?: string;
}

const SpecsModal: React.FC<{ specs: string; onClose: () => void }> = ({ specs, onClose }) => (
    <Modal isOpen={true} onClose={onClose}>
        <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold text-primary-dark dark:text-white mb-4">Specifications & Features</h2>
            <div dangerouslySetInnerHTML={{ __html: marked.parse(specs) }} />
        </div>
    </Modal>
);

const ColorSelectionModal: React.FC<{ product: Product; onClose: () => void; onSelect: (color: string) => void }> = ({ product, onClose, onSelect }) => (
    <Modal isOpen={true} onClose={onClose}>
        <div>
            <h2 className="text-xl font-bold text-primary-dark dark:text-white">Choose a Color for {product.name}</h2>
            <div className="mt-4 space-y-2">
                {product.colors?.map(color => (
                    <button
                        key={color.name}
                        onClick={() => onSelect(color.name)}
                        disabled={color.stock <= 0}
                        className="w-full flex items-center p-3 rounded-md border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                        <span className="h-6 w-6 rounded-full border dark:border-gray-600" style={{ backgroundColor: color.hex }}></span>
                        <span className="ml-3 font-medium flex-grow text-left">{color.name}</span>
                        {color.stock <= 0 && <span className="text-xs text-red-500">Out of Stock</span>}
                    </button>
                ))}
            </div>
        </div>
    </Modal>
);


const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
    const { addToCart } = useCart();
    const [isSpecsModalOpen, setSpecsModalOpen] = useState(false);
    const [isColorModalOpen, setColorModalOpen] = useState(false);

    const handleAddToCart = () => {
        if (product.colors && product.colors.length > 0) {
            setColorModalOpen(true);
        } else {
            addToCart(product);
        }
    };

    const handleColorSelect = (colorName: string) => {
        addToCart(product, 1, colorName);
        setColorModalOpen(false);
    };
    
    const stockStatus = product.stock > 0 ? 'In Stock' : 'Out of stock';
    const stockStatusColor = product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <>
            <Card className={`overflow-hidden flex flex-col ${className}`}>
                <img src={product.imageUrl} alt={product.name} className="h-72 w-full object-cover"/>
                <CardContent className="p-4 flex-grow">
                    <h3 className="font-semibold text-lg text-primary-dark dark:text-white">{product.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{product.category}</p>
                        <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${stockStatusColor}`}></span>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stockStatus}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4 pt-0">
                    <p className="font-bold text-xl text-primary-dark dark:text-white">Ksh {product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                        {product.specs && (
                            <Button size="icon" variant="outline" onClick={() => setSpecsModalOpen(true)}>
                                <Icons.Menu className="h-4 w-4" />
                            </Button>
                        )}
                        <Button size="sm" variant="accent" onClick={handleAddToCart} disabled={product.stock <= 0}>
                            {product.stock <= 0 ? 'Out of Stock' : 'Add'}
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {isSpecsModalOpen && product.specs && (
                <SpecsModal specs={product.specs} onClose={() => setSpecsModalOpen(false)} />
            )}

            {isColorModalOpen && (
                <ColorSelectionModal product={product} onClose={() => setColorModalOpen(false)} onSelect={handleColorSelect} />
            )}
        </>
    );
};

export default ProductCard;
