'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks! We'll get back to you soon 💌");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold">Get in touch</h1>
      <p className="mt-2 text-bloom-charcoal/60">Questions, feedback, or partnership ideas — we'd love to hear from you.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        <input required type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
        <textarea required placeholder="Your message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field" />
        <button type="submit" className="btn-primary">Send message</button>
      </form>
    </div>
  );
}
