import React from 'react';
import { Icons } from '../components/icons';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { useData } from '../src/contexts/DataContext';

const ContactPage: React.FC = () => {
    const { settings } = useData();
    
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log("Contact form submitted:", data);
        alert("Thank you for your message! We'll get back to you soon.");
        e.currentTarget.reset();
    };

    return (
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center tracking-tight text-primary-dark dark:text-white sm:text-5xl">Get in Touch</h1>
                <p className="mt-4 max-w-2xl text-lg text-center mx-auto text-gray-600 dark:text-gray-400">
                    We're here to help and answer any question you might have. We look forward to hearing from you!
                </p>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <Card>
                         <CardContent className="p-6">
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary-dark dark:text-white">Send us a Message</h2>
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium dark:text-gray-300">Full Name</label>
                                    <Input id="name" name="name" type="text" placeholder="Your Name" required/>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium dark:text-gray-300">Email Address</label>
                                    <Input id="email" name="email" type="email" placeholder="you@example.com" required/>
                                </div>
                                 <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium dark:text-gray-300">Message</label>
                                    <textarea id="message" name="message" rows={5} required
                                        className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal dark:bg-gray-900/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                        placeholder="How can we help?"
                                    ></textarea>
                                </div>
                                <Button type="submit" variant="accent" className="w-full">Send Message</Button>
                            </form>
                         </CardContent>
                    </Card>

                    {/* Contact Details */}
                    <div className="space-y-8">
                       <h2 className="text-2xl font-bold text-primary-dark dark:text-white">Contact Information</h2>
                       <div className="space-y-4">
                           <div className="flex items-start">
                               <Icons.MapPin className="h-6 w-6 mr-4 mt-1 text-accent-teal flex-shrink-0" />
                               <div>
                                   <h3 className="font-semibold dark:text-white">Our Location</h3>
                                   <p className="text-gray-600 dark:text-gray-400">{settings.location}</p>
                               </div>
                           </div>
                           <div className="flex items-start">
                               <Icons.Mail className="h-6 w-6 mr-4 mt-1 text-accent-teal flex-shrink-0" />
                               <div>
                                   <h3 className="font-semibold dark:text-white">Email Us</h3>
                                   <a href={`mailto:${settings.contactEmail}`} className="text-accent-teal hover:underline">{settings.contactEmail}</a>
                               </div>
                           </div>
                       </div>
                       <div>
                            <h3 className="text-xl font-bold text-primary-dark dark:text-white mb-4">Follow Us</h3>
                            <div className="flex items-center space-x-4">
                                {settings.socials.map(social => {
                                    const IconComponent = Icons[social.icon];
                                    return (
                                        <a key={social.id} href={social.url} target="_blank" rel="noreferrer" title={social.name} className="text-gray-500 dark:text-gray-400 hover:text-accent-teal dark:hover:text-accent-teal p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                            <IconComponent className="h-6 w-6" />
                                        </a>
                                    )
                                })}
                            </div>
                       </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;