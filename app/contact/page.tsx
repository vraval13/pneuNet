'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import emailjs from 'emailjs-com';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace these with your EmailJS service ID, template ID, and user ID
      const serviceId = 'service_n215uqv';
      const templateId = 'template_avk9ebm';
      const userId = 'C5ywNTuzuwfUyJ6A_';

      await emailjs.send(serviceId, templateId, formData, userId);
      setSuccessMessage('Your message has been sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      setSuccessMessage('Failed to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Have questions or need assistance? Reach out to us, and we’ll be happy to help. Our team is here to support you.
          </p>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-background/50 backdrop-blur rounded-lg text-center">
              <Mail className="w-12 h-12 mb-4 text-primary mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Email Us</h3>
              <p className="text-muted-foreground">
                Send us an email at <a href="mailto:22bce301@nirmauni.ac.in" className="text-primary hover:underline">22bce301@nirmauni.ac.in</a>
              </p>
            </div>
            <div className="p-6 bg-background/50 backdrop-blur rounded-lg text-center">
              <Phone className="w-12 h-12 mb-4 text-primary mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Call Us</h3>
              <p className="text-muted-foreground">
                Reach us at <a href="tel:+1234567890" className="text-primary hover:underline">+91 9409541314</a>
              </p>
            </div>
            <div className="p-6 bg-background/50 backdrop-blur rounded-lg text-center">
              <MapPin className="w-12 h-12 mb-4 text-primary mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Visit Us</h3>
              <p className="text-muted-foreground">
                Nirma University, Ahmedabad, Gujarat, India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Send Us a Message</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-background/50 text-foreground placeholder-muted-foreground border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-background/50 text-foreground placeholder-muted-foreground border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <textarea
              name="message"
              placeholder="Your Message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-background/50 text-foreground placeholder-muted-foreground border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          {successMessage && (
            <p className="text-center mt-4 text-foreground">{successMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
}