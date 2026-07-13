'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser, getProfile } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getProfile();
      setUser(data);
    } catch (err) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (username, password) => {
    const { data } = await loginUser({ username, password });
    Cookies.set('access_token', data.access, { expires: 1 });
    Cookies.set('refresh_token', data.refresh, { expires: 7 });
    
    // 🚀 THE POPUP TRIGGER FLAGS
    localStorage.setItem('username', username);
    localStorage.setItem('trigger_welcome_popup', 'true');
    
    await loadUser();
  };

  const register = async (formData) => {
    // Reconstruct fields layout block matching Django accounts.UserProfile model serializers exactly
    const registrationPayload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      profile: {
        phone_number: formData.phone.trim(),
        district: formData.district.trim(),
        place: formData.place.trim(),
        pincode: formData.pincode.trim()
      }
    };

    await registerUser(registrationPayload);
    // Auto login after profile registration compile loops finishes
    await login(formData.username, formData.password);
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.clear();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);