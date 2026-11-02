'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Header from '@/components/Header';
import { AccountSkeleton } from '@/components/Skeletons';

const fieldClass =
  'border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-150 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5';
const labelClass = 'text-xs font-medium text-gray-500';

export default function AccountPage() {
  const { user, token, login, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  if (loading || !user) {
    return (
      <>
        <Header />
        <AccountSkeleton />
      </>
    );
  }

  const handleNameSave = async (e) => {
    e.preventDefault();
    setSavingName(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      login({ ...data, token });
      toast({ message: 'Profile updated.', type: 'success' });
    } catch (err) {
      toast({ message: err.message, type: 'error' });
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({ message: 'Password updated.', type: 'success' });
    } catch (err) {
      setPasswordError(err.message);
      toast({ message: err.message, type: 'error' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Account</h1>

        <form
          onSubmit={handleNameSave}
          className="flex flex-col gap-4 border border-gray-200 rounded-2xl p-6 mb-6"
        >
          <h3 className="text-sm font-medium text-gray-900">Profile</h3>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Email</label>
            <input
              value={user?.email || ''}
              disabled
              className={`${fieldClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
            />
          </div>

          <button
            type="submit"
            disabled={savingName}
            className="self-start bg-gray-900 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {savingName && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {savingName ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        <form
          onSubmit={handlePasswordSave}
          className="flex flex-col gap-4 border border-gray-200 rounded-2xl p-6"
        >
          <h3 className="text-sm font-medium text-gray-900">Change password</h3>

          {passwordError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
              {passwordError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="self-start bg-gray-900 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {savingPassword && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {savingPassword ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </main>
    </>
  );
}