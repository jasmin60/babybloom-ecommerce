'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, setUser, loading } = useAuth();
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    profile: { phone_number: '', place: '', district: '', pincode: '' },
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        profile: {
          phone_number: user.profile?.phone_number || '',
          place: user.profile?.place || '',
          district: user.profile?.district || '',
          pincode: user.profile?.pincode || '',
        },
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await updateProfile(form);
      setUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Could not update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="py-24 text-center text-bloom-charcoal/60">Loading...</p>;
  if (!user) return <p className="py-24 text-center text-bloom-charcoal/60">Please sign in to view your account.</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold">My account</h1>
      <p className="mt-1 text-bloom-charcoal/60">Signed in as {user.username}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="input-field" />
          <input placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="input-field" />
        </div>
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
        <input placeholder="Phone Number" value={form.profile.phone_number} onChange={(e) => setForm({ ...form, profile: { ...form.profile, phone_number: e.target.value } })} className="input-field" />
        <input placeholder="City / Place Address" value={form.profile.place} onChange={(e) => setForm({ ...form, profile: { ...form.profile, place: e.target.value } })} className="input-field" />
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="District" value={form.profile.district} onChange={(e) => setForm({ ...form, profile: { ...form.profile, district: e.target.value } })} className="input-field" />
          <input placeholder="Pincode" value={form.profile.pincode} onChange={(e) => setForm({ ...form, profile: { ...form.profile, pincode: e.target.value } })} className="input-field" />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}