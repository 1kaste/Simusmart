import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Icons } from '../../components/icons';
import { GoogleGenAI } from "@google/genai";
import { Product } from '../../data/mock-data';
import Modal from '../../src/components/ui/Modal';
import ProductCard from '../../components/ProductCard';
import { useData } from '../../src/contexts/DataContext';

const AIPreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  suggestions: Product[];
  onAccept: (suggestions: Product[]) => void;
  isLoading: boolean;
  error: string | null;
}> = ({ isOpen, onClose, suggestions, onAccept, isLoading, error }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary-dark dark:text-white">AI Product Suggestions</h2>
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Icons.RefreshCcw className="h-8 w-8 animate-spin text-accent-teal" />
            <p className="ml-4 text-lg">Generating ideas...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-md">
            <p className="font-bold">An error occurred:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && suggestions.length > 0 && (
          <>
            <p className="text-gray-600 dark:text-gray-400">Here are some new product ideas. Would you like to add them to your 'Latest Arrivals'?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-2">
              {suggestions.map((p, index) => (
                <ProductCard key={`${p.id}-${index}`} product={p} />
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button variant="accent" onClick={() => onAccept(suggestions)}>Accept Suggestions</Button>
            </div>
          </>
        )}
        {!isLoading && !error && suggestions.length === 0 && (
          <p>No suggestions were generated. Try again.</p>
        )}
      </div>
    </Modal>
  );
};

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { products, categories, orders, addProducts } = useData();

  const handleAIRefresh = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    setError(null);
    setSuggestedProducts([]);

    if (!process.env.API_KEY) {
        setError("API_KEY environment variable not found.");
        setIsLoading(false);
        return;
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const existingProductNames = products.map(p => p.name).join(', ');
      const existingCategoryNames = categories.map(c => c.name).join(', ');
      
      const prompt = `
        Based on the following list of existing smart device products: ${existingProductNames}.
        And the existing categories: ${existingCategoryNames}.
        Suggest 3 new, trendy, and exciting smart device products that would complement this store. 
        Return the response as a valid JSON array. Each object in the array must be a product with the following structure:
        { "id": "prod_aixxx", "name": "Product Name", "price": 12345, "imageUrl": "https://picsum.photos/seed/...", "category": "Existing Category Name" }
        Ensure the "price" is a number (in Ksh, e.g., 65000), and "category" is one of the existing categories.
        Generate a unique seed for each picsum.photos URL.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
      });
      
      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedData = JSON.parse(jsonStr);

      if (Array.isArray(parsedData)) {
          // Basic validation
          const validProducts = parsedData.filter(p => p.name && p.price && p.category && p.imageUrl && p.id);
          setSuggestedProducts(validProducts);
      } else {
          throw new Error("AI response was not a JSON array.");
      }
      
    } catch (e: any) {
      console.error("Gemini API Error:", e);
      setError(e.message || "Failed to fetch suggestions from AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestions = (suggestions: Product[]) => {
    addProducts(suggestions);
    alert(`${suggestions.length} new products have been added to 'Latest Arrivals'!`);
    setIsModalOpen(false);
  };

  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const newOrdersToday = orders.filter(o => {
    const today = new Date().toISOString().split('T')[0];
    return o.date === today;
  }).length;


  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary-dark dark:text-white">Admin Dashboard</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>
              Use AI to optimize your product listings and keep your store fresh.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <p className="text-gray-600 dark:text-gray-300">Get new product suggestions for the "Latest Arrivals" section.</p>
              <Button onClick={handleAIRefresh} disabled={isLoading}>
                {isLoading ? <Icons.RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <Icons.RefreshCcw className="mr-2 h-4 w-4" />}
                {isLoading ? 'Generating...' : 'Refresh with AI'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                 <CardDescription>From delivered orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">Ksh {totalRevenue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
                <CardDescription>All-time orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{orders.length}</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400">{newOrdersToday} new orders today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Products in Store</CardTitle>
                <CardDescription>Total sellable products</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{products.length}</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400">{categories.length} categories</p>
              </CardContent>
            </Card>
        </div>
      </div>
      <AIPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        suggestions={suggestedProducts}
        onAccept={handleAcceptSuggestions}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
};

export default DashboardPage;