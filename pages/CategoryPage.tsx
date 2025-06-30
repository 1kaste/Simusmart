import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import { useData } from '../src/contexts/DataContext';


const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { categories, products } = useData();
  
  const category = categories.find(c => c.id === categoryName);
  const filteredProducts = products.filter(p => p.category.toLowerCase() === category?.name.toLowerCase());

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold">Category Not Found</h1>
          <p className="mt-4">The category you are looking for does not exist.</p>
          <Link to="/"><Button className="mt-8">Go Back Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-primary-dark dark:text-white mb-10">
        {category.name}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="col-span-full text-center">No products found in this category yet.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;