import React from 'react';
import { Link } from 'react-router-dom';
import { Category, StoreSettings } from '../data/mock-data';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import { useData } from '../src/contexts/DataContext';


const HeroSection: React.FC<{ settings: StoreSettings, onExploreClick: () => void }> = ({ settings, onExploreClick }) => {
  const heroStyle = settings.heroImageUrl 
    ? { backgroundImage: `url('${settings.heroImageUrl}')` }
    : {};

  const heroClasses = settings.heroImageUrl
    ? 'bg-cover bg-center'
    : 'bg-gradient-to-br from-gray-900 via-primary-dark to-gray-800';

  return (
    <section 
      className={`w-full text-white ${heroClasses}`}
      style={heroStyle}
    >
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-32 bg-black/40 backdrop-blur-sm">
        <h1 
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          style={{ color: settings.heroTextColor }}
        >
          {settings.heroTitle}
        </h1>
        <p 
          className="mt-4 max-w-2xl text-lg"
          style={{ color: settings.heroTextColor, opacity: 0.9 }}
        >
          {settings.heroSubtitle}
        </p>
        <Button size="lg" variant="accent" className="mt-8" onClick={onExploreClick}>
          Explore Now
        </Button>
      </div>
    </section>
  );
};

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => (
  <div className="group relative overflow-hidden rounded-lg">
    <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
    <div className="absolute inset-0 bg-black/40" />
    <div className="absolute inset-0 flex items-center justify-center">
      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
    </div>
    <Link to={`/category/${category.id}`} className="absolute inset-0" aria-label={`View ${category.name}`}>
      <span className="sr-only">View {category.name}</span>
    </Link>
  </div>
);

const CategoriesSection: React.FC = () => {
    const { categories } = useData();
    return (
        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-center text-primary-dark dark:text-white">Shop by Category</h2>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
            </div>
            </div>
        </section>
    );
};

const LatestArrivalsSection = React.forwardRef<HTMLElement>((props, ref) => {
    const { products } = useData();
    return (
        <section ref={ref} className="py-16 sm:py-24 bg-gray-50 dark:bg-primary-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-center text-primary-dark dark:text-white">Latest Arrivals</h2>
            <div className="relative mt-12">
                <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
                {products.slice(0, 8).map(prod => <ProductCard key={prod.id} product={prod} className="flex-shrink-0 w-64 snap-start" />)}
                </div>
            </div>
            </div>
        </section>
    );
});


const HomePage: React.FC = () => {
  const latestArrivalsRef = React.useRef<HTMLElement>(null);
  const { settings } = useData();
  
  const handleExploreClick = () => {
    latestArrivalsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HeroSection settings={settings} onExploreClick={handleExploreClick}/>
      <CategoriesSection />
      <LatestArrivalsSection ref={latestArrivalsRef} />
    </>
  );
};

export default HomePage;