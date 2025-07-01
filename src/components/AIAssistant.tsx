
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { marked } from 'marked';

import { useData } from '../src/contexts/DataContext';
import { Icons } from './icons';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card } from './ui/Card';

interface Message {
    role: 'user' | 'model';
    content: string;
}

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { products, settings } = useData();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Automatically scroll to the bottom of the chat
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!isOpen || chat) return; // Only initialize once when opened

        if (!process.env.API_KEY) {
            setError("The AI assistant is offline. API_KEY is missing.");
            return;
        }
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const productList = products.map(p => {
                const colorInfo = p.colors && p.colors.length > 0
                    ? `Available colors are: ${p.colors.filter(c => c.stock > 0).map(c => c.name).join(', ')}.`
                    : "This product doesn't have specific color options.";
                const specsInfo = p.specs ? `It has the following features: ${p.specs.replace(/###/g, '').replace(/\n/g, ' ')}` : '';
                return `- ${p.name} (Category: ${p.category}, Price: Ksh ${p.price}). ${colorInfo} ${specsInfo}`;
            }).join('\n');
            
            const systemInstruction = `You are a friendly and helpful shopping assistant for an online store called "${settings.shopName}".
Your goal is to help users find products and answer their questions based on the provided list.
Be concise and conversational.
NEVER mention stock numbers or quantity. Only mention if a color is available or out of stock.
Use the following product list to answer questions. Do not invent products or features.
Product List:
${productList}

If asked about store policies (shipping, returns, etc.), you can provide helpful, generic e-commerce answers, as you don't have access to the specific store policies.
If you can't answer a question, politely say so and suggest they contact support at ${settings.contactEmail}.`;

            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash-preview-04-17',
                config: { systemInstruction },
            });
            setChat(newChat);
            setMessages([{ role: 'model', content: "Hello! How can I help you find the perfect smart device today?" }]);
        } catch (e) {
            console.error("Failed to initialize AI Chat:", e);
            setError("Could not connect to the AI assistant.");
        }
    }, [isOpen, chat, products, settings]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userInput: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userInput]);
        setInput('');
        setIsLoading(true);
        setError(null);
        
        try {
            const responseStream = await chat.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]); 

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = modelResponse;
                    return newMessages;
                });
            }
        } catch (e: any) {
            console.error("Gemini stream error:", e);
            setError("Sorry, I encountered an error. Please try again.");
            setMessages(prev => prev.slice(0, -1)); // Remove the empty model message
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="accent"
                size="icon"
                className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-110 z-50"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle AI Assistant"
            >
                <Icons.Bot className="h-8 w-8" />
            </Button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 mb-4 sm:mb-0">
                    <Card className="w-[calc(100vw-3rem)] sm:w-96 h-[60vh] flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center p-3 border-b dark:border-gray-700">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Icons.Bot className="h-5 w-5 text-accent-teal" />
                                AI Shopping Assistant
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><Icons.X className="h-5 w-5"/></Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`prose prose-sm dark:prose-invert max-w-xs lg:max-w-sm rounded-lg px-3 py-2 ${
                                            msg.role === 'user'
                                                ? 'bg-accent-teal text-white'
                                                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                                    />
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 flex items-center">
                                       <span className="h-2 w-2 bg-accent-teal rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                       <span className="h-2 w-2 bg-accent-teal rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></span>
                                       <span className="h-2 w-2 bg-accent-teal rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="flex items-center p-3 border-t dark:border-gray-700 gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about products..."
                                className="flex-1"
                                disabled={isLoading || !!error}
                            />
                            <Button type="submit" size="icon" variant="accent" disabled={isLoading || !input.trim()}>
                                <Icons.Send className="h-5 w-5" />
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </>
    );
};

export default AIAssistant;
