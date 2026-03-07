import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const ContactUsPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            // Optional: extract API URL to an env variable, but /api handles proxy in Vite
            await axios.post('/api/contact', form, config);

            toast.success('Message sent! We will get back to you soon.');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-16 min-h-screen z-[1]">
            <div className="page-container max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="section-heading mb-4">Contact Us</h1>
                    <p className="section-subheading">We'd love to hear from you</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                    {/* Contact Info */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="card p-6 border-l-4 border-l-primary-500">
                            <FiMapPin className="text-3xl text-primary-400 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Visit Us</h3>
                            <p className="text-gray-400 text-sm">
                                123 Festival Street, Garba Chowk<br />
                                Ahmedabad, Gujarat, India 380001
                            </p>
                        </div>

                        <div className="card p-6 border-l-4 border-l-gold-500">
                            <FiPhone className="text-3xl text-gold-400 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Call Us</h3>
                            <p className="text-gray-400 text-sm">+91 98765 43210</p>
                            <p className="text-gray-500 text-xs mt-1">Mon-Sat, 9AM to 6PM</p>
                        </div>

                        <div className="card p-6 border-l-4 border-l-maroon-500">
                            <FiMail className="text-3xl text-maroon-400 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
                            <p className="text-gray-400 text-sm">hello@harshdandiya.com</p>
                            <p className="text-gray-400 text-sm">support@harshdandiya.com</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card p-8 lg:col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field text-sm"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="input-field text-sm"
                                        placeholder="john@example.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Subject</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field text-sm"
                                    placeholder="Bulk Order Inquiry"
                                    value={form.subject}
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Message</label>
                                <textarea
                                    required
                                    rows="5"
                                    className="input-field text-sm resize-none"
                                    placeholder="How can we help you?"
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto mt-2 disabled:opacity-70">
                                {loading ? 'Sending...' : <><FiSend /> Send Message</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
