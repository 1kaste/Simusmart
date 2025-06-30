
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { Product } from '../data/mock-data';
import { useData } from '../contexts/DataContext';
import ProductCard from '../components/ProductCard';
import { Icons } from '../components/icons';

const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const { products } = useData();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [foundProducts, setFoundProducts] = useState<Product[]>([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        const performSearch = async () => {
            if (!query || products.length === 0) return;

            setIsLoading(true);
            setError(null);
            setFoundProducts([]);
            
            if (!isOnline) {
                setError("You are offline. Please connect to the internet to use search.");
                setIsLoading(false);
                return;
            }

            if (!process.env.API_KEY) {
                setError("Search is currently unavailable. API_KEY is not configured.");
                setIsLoading(false);
                return;
            }

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const productInfoForAI = products.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                }));

                const prompt = `
                    You are a semantic search engine for an e-commerce store.
                    Based on the user query, find the most relevant products from the provided JSON product list.
                    User Query: "${query}"
                    Product List (JSON): ${JSON.stringify(productInfoForAI)}

                    Return a valid JSON array of product IDs that are the best matches. For example: ["prod1", "prod8"].
                    If no products match well, return an empty array [].
                    Do not return anything else, only the JSON array of product IDs.
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

                const foundIds = JSON.parse(jsonStr);

                if (Array.isArray(foundIds)) {
                    const matchedProducts = foundIds
                        .map(id => products.find(p => p.id === id))
                        .filter((p): p is Product => p !== undefined);
                    setFoundProducts(matchedProducts);
                } else {
                    throw new Error("AI response was not in the expected format.");
                }

            } catch (e: any) {
                console.error("Gemini Search Error:", e);
                setError(e.message || "Failed to perform search.");
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [query, products, isOnline]);

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary-dark dark:text-white mb-2">
                Search Results
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                {isLoading ? 'Searching...' : `Showing results for "${query}"`}
            </p>

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <Icons.RefreshCcw className="h-12 w-12 animate-spin text-accent-teal" />
                </div>
            )}

            {error && (
                <div className="text-center py-20">
                    <p className="text-red-500 font-semibold">Something went wrong</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
                </div>
            )}

            {!isLoading && !error && (
                foundProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {foundProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Icons.Package className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
                        <h2 className="mt-6 text-2xl font-semibold text-primary-dark dark:text-white">No Products Found</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">We couldn't find any products matching your search. Try a different query.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default SearchResultsPage;
