'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', phone: '', district: '', place: '', pincode: '', password: '', password2: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      toast.error('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to Baby Bloom 🌸');
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Could not instantiate model columns. Check username unique values.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl font-extrabold">Create your account</h1>
      <p className="mt-1 text-bloom-charcoal/60">Join thousands of happy parents.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input required name="username" placeholder="Username Handle" value={form.username} onChange={handleChange} className="input-field" />
        <input required type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} className="input-field" />
        <input required type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="input-field" />
        
        <div className="grid grid-cols-3 gap-2">
          <input required name="district" placeholder="District" value={form.district} onChange={handleChange} className="input-field" />
          <input required name="place" placeholder="Place / City" value={form.place} onChange={handleChange} className="input-field" />
          <input required name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="input-field" />
        </div>

        <input required type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="input-field" />
        <input required type="password" name="password2" placeholder="Confirm password" value={form.password2} onChange={handleChange} className="input-field" />
        
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Initializing Workspace...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-bloom-charcoal/60">
        Already have an account? <Link href="/login" className="font-semibold text-bloom-pinkDark">Sign in</Link>
      </p>
    </div>
  );
}