import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';
import { db } from '../config/firebase.config';// adjust path if needed
import { collection, addDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }; 

  const sendEmail = async () => {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    try { 
      await emailjs.send(
        'service_oyaixjv',   // Replace with your actual EmailJS service ID
        'template_eij6tx8',  // Replace with your template ID
        templateParams,
        'eanZLk3yjjGqS5WKH'       // Replace with your EmailJS user/public key
      );
    } catch (error) {
      console.error('Email send failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields.');
      return;
    }
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        timestamp: new Date(),
      });
      await sendEmail();

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <section className="bg-gradient-to-b bg-slate-800 text-gray-900 min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-teal-500">Get In Touch</h1>
        <p className="text-lg text-yellow-100 mb-10">
          We'd love to hear from you! Whether you have questions, feedback, or just want to chat, feel free to reach out.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-8 mb-12 items-center text-left">
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-teal-500" />
            <a href="mailto:support@yourwebsite.com" className="text-lg text-teal-600">
              support@yourwebsite.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-teal-500" />
            <a href="tel:+1234567890" className="text-lg text-teal-600">
              +1 234 567 890
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-teal-500" />
            <span className="text-lg text-teal-600">123 Business Ave, City, Country</span>
          </div>
        </div>

        {isSubmitted && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            <p>Your message has been sent successfully!</p>
          </div>
        )}

        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg border border-teal-100 p-10 rounded-2xl shadow-2xl max-w-3xl w-full transition-all duration-300 hover:shadow-teal-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full border-b-2 border-gray-300 py-3 pl-10 pr-4 text-orange-300 bg-transparent focus:outline-none focus:border-teal-500"
                />
                <label htmlFor="name" className="absolute left-10 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-teal-600">
                  Name
                </label>
                <FaEnvelope className="absolute left-3 top-4 text-gray-400 peer-focus:text-teal-500" />
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full border-b-2 border-gray-300 py-3 pl-10 pr-4 text-orange-300 bg-transparent focus:outline-none focus:border-teal-500"
                />
                <label htmlFor="email" className="absolute left-10 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-teal-600">
                  Email
                </label>
                <FaPhoneAlt className="absolute left-3 top-4 text-gray-400 peer-focus:text-teal-500" />
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder=" "
                  className="peer w-full border-b-2 border-gray-300 py-3 pl-10 pr-4 text-orange-300 bg-transparent resize-none focus:outline-none focus:border-teal-500"
                />
                <label htmlFor="message" className="absolute left-10 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-teal-600">
                  Message
                </label>
                <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-400 peer-focus:text-teal-500" />
              </div>

              <button
                type="submit"
                className={`w-full py-3 bg-teal-500 text-white font-semibold rounded-lg transform transition duration-300 ${
                  isSubmitted ? 'animate-pulse scale-105' : 'hover:scale-105 hover:bg-teal-600'
                }`}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-teal-600">Find Us</h2>
          <div className="mt-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=..." // your embed link
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-xl shadow-lg"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8">
        <button
          title="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition duration-300"
        >
          <FaArrowUp className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default Contact;



// Would you like me to start with Firestore integration, full form validation, or email notifications?                 do all three




