'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Users,
  Settings,
  Trophy,
  Plus,
  Download,
  RefreshCw,
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

interface Entry {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedNumber: number;
  amountCharged: number;
  paymentId: string | null;
  entryType: 'PRIMARY' | 'OVERFLOW' | 'MANUAL';
  status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
}

interface RaffleSettings {
  campaignName: string;
  prizeDescription: string;
  cashValue: number;
  isActive: boolean;
  overflowEnabled: boolean;
  overflowDuration: number;
  winnerId: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [settings, setSettings] = useState<RaffleSettings | null>(null);
  const [winner, setWinner] = useState<Entry | null>(null);
  const [activeTab, setActiveTab] = useState<'entries' | 'settings' | 'add'>('entries');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Manual entry state
  const [manualEntry, setManualEntry] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
  });
  const [manualEntryError, setManualEntryError] = useState('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/admin/entries', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setIsAuthenticated(true);
        await Promise.all([fetchEntries(token), fetchSettings(token)]);
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        await Promise.all([fetchEntries(data.token), fetchSettings(data.token)]);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function fetchEntries(token: string) {
    try {
      const res = await fetch('/api/admin/entries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.entries) {
        setEntries(data.entries);
        // Check for winner
        if (settings?.winnerId) {
          const winnerEntry = data.entries.find((e: Entry) => e.id === settings.winnerId);
          if (winnerEntry) setWinner(winnerEntry);
        }
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    }
  }

  async function fetchSettings(token: string) {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
        // If winner exists, find them in entries
        if (data.settings.winnerId && entries.length > 0) {
          const winnerEntry = entries.find((e) => e.id === data.settings.winnerId);
          if (winnerEntry) setWinner(winnerEntry);
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  }

  async function handleDrawWinner() {
    if (!confirm('Are you sure you want to draw a winner? This action cannot be undone.')) {
      return;
    }

    setIsDrawing(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/draw', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` || '' },
      });
      const data = await res.json();
      if (data.success && data.winner) {
        setWinner(data.winner);
        alert(`Winner drawn: ${data.winner.name} with entry #${data.winner.assignedNumber}!`);
      } else {
        alert(data.error || 'Failed to draw winner');
      }
    } catch (error) {
      alert('Failed to draw winner');
    } finally {
      setIsDrawing(false);
    }
  }

  async function handleAddManualEntry(e: React.FormEvent) {
    e.preventDefault();
    setManualEntryError('');
    setIsAddingEntry(true);

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || '',
        },
        body: JSON.stringify({
          ...manualEntry,
          amount: parseInt(manualEntry.amount) * 100, // Convert to cents
        }),
      });
      const data = await res.json();
      if (data.success) {
        setManualEntry({ name: '', email: '', phone: '', amount: '' });
        await fetchEntries(token || '');
        setActiveTab('entries');
        alert(`Entry #${data.entry.assignedNumber} added successfully!`);
      } else {
        setManualEntryError(data.error || 'Failed to add entry');
      }
    } catch (error) {
      setManualEntryError('Failed to add entry');
    } finally {
      setIsAddingEntry(false);
    }
  }

  async function handleUpdateSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || '',
        },
        body: JSON.stringify({
          campaignName: settings.campaignName,
          prizeDescription: settings.prizeDescription,
          cashValue: settings.cashValue,
          isActive: settings.isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Settings updated successfully!');
      } else {
        alert(data.error || 'Failed to update settings');
      }
    } catch (error) {
      alert('Failed to update settings');
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setEntries([]);
    setSettings(null);
  }

  function exportToCSV() {
    const headers = ['Number', 'Name', 'Email', 'Phone', 'Amount', 'Type', 'Status', 'Date'];
    const rows = entries.map((e) => [
      e.assignedNumber,
      e.name,
      e.email,
      e.phone,
      `$${(e.amountCharged / 100).toFixed(2)}`,
      e.entryType,
      e.status,
      new Date(e.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raffle-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  const filteredEntries = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.assignedNumber.toString().includes(searchTerm)
  );

  const confirmedEntries = entries.filter((e) => e.status === 'CONFIRMED');
  const totalRevenue = confirmedEntries.reduce((sum, e) => sum + e.amountCharged, 0);
  const primaryCount = entries.filter((e) => e.entryType === 'PRIMARY' && e.status === 'CONFIRMED').length;
  const overflowCount = entries.filter((e) => e.entryType === 'OVERFLOW' && e.status === 'CONFIRMED').length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--fc-teal)' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--fc-navy)' }}>
            Admin Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            {loginError && <p className="error-message">{loginError}</p>}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn btn-primary w-full"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold" style={{ color: 'var(--fc-navy)' }}>
              Raffle Admin
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Total Entries
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--fc-navy)' }}>
              {confirmedEntries.length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Total Revenue
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--fc-teal)' }}>
              ${(totalRevenue / 100).toLocaleString()}
            </p>
          </div>
          <div className="card">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Primary / Overflow
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--fc-navy)' }}>
              {primaryCount} / {overflowCount}
            </p>
          </div>
          <div className="card">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Remaining
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--fc-navy)' }}>
              {360 - primaryCount}
            </p>
          </div>
        </div>

        {/* Winner Card */}
        {winner && (
          <div
            className="card mb-8 border-2"
            style={{ borderColor: 'var(--fc-teal)', backgroundColor: 'rgba(54, 187, 174, 0.05)' }}
          >
            <div className="flex items-center gap-4">
              <Trophy className="w-12 h-12" style={{ color: 'var(--fc-teal)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--fc-teal)' }}>
                  Winner
                </p>
                <p className="text-xl font-bold" style={{ color: 'var(--fc-navy)' }}>
                  {winner.name} - Entry #{winner.assignedNumber}
                </p>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  {winner.email} | {winner.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setActiveTab('entries')}
            className={`px-4 py-2 font-medium border-b-2 -mb-px transition ${
              activeTab === 'entries'
                ? 'border-[var(--fc-teal)] text-[var(--fc-teal)]'
                : 'border-transparent text-[var(--muted-foreground)]'
            }`}
          >
            <Users className="w-4 h-4 inline-block mr-2" />
            Entries
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 font-medium border-b-2 -mb-px transition ${
              activeTab === 'add'
                ? 'border-[var(--fc-teal)] text-[var(--fc-teal)]'
                : 'border-transparent text-[var(--muted-foreground)]'
            }`}
          >
            <Plus className="w-4 h-4 inline-block mr-2" />
            Add Entry
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-medium border-b-2 -mb-px transition ${
              activeTab === 'settings'
                ? 'border-[var(--fc-teal)] text-[var(--fc-teal)]'
                : 'border-transparent text-[var(--muted-foreground)]'
            }`}
          >
            <Settings className="w-4 h-4 inline-block mr-2" />
            Settings
          </button>
        </div>

        {/* Entries Tab */}
        {activeTab === 'entries' && (
          <div className="card">
            <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
              <div className="relative">
                <Search
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted-foreground)' }}
                />
                <input
                  type="text"
                  placeholder="Search entries..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const token = localStorage.getItem('admin_token');
                    if (token) fetchEntries(token);
                  }}
                  className="btn btn-outline"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button onClick={exportToCSV} className="btn btn-outline">
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                {!winner && (
                  <button
                    onClick={handleDrawWinner}
                    disabled={isDrawing || confirmedEntries.length === 0}
                    className="btn btn-primary"
                  >
                    {isDrawing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Drawing...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4" />
                        Draw Winner
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--muted-foreground)' }}>
                      #
                    </th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--muted-foreground)' }}>
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--muted-foreground)' }}>
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--muted-foreground)' }}>
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--muted-foreground)' }}>
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--muted-foreground)' }}>
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--muted-foreground)' }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`border-b hover:bg-gray-50 ${
                        winner?.id === entry.id ? 'bg-[rgba(54,187,174,0.1)]' : ''
                      }`}
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <td className="py-3 px-4 font-bold" style={{ color: 'var(--fc-navy)' }}>
                        {entry.assignedNumber}
                        {winner?.id === entry.id && (
                          <Trophy className="w-4 h-4 inline-block ml-2" style={{ color: 'var(--fc-teal)' }} />
                        )}
                      </td>
                      <td className="py-3 px-4" style={{ color: 'var(--fc-navy)' }}>
                        {entry.name}
                      </td>
                      <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)' }}>
                        {entry.email}
                      </td>
                      <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)' }}>
                        {entry.phone}
                      </td>
                      <td className="py-3 px-4 font-medium" style={{ color: 'var(--fc-teal)' }}>
                        ${(entry.amountCharged / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            entry.entryType === 'MANUAL'
                              ? 'bg-purple-100 text-purple-800'
                              : entry.entryType === 'OVERFLOW'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {entry.entryType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1">
                          {entry.status === 'CONFIRMED' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : entry.status === 'PENDING' ? (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`text-sm ${
                              entry.status === 'CONFIRMED'
                                ? 'text-green-600'
                                : entry.status === 'PENDING'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {entry.status}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredEntries.length === 0 && (
                <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
                  No entries found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Entry Tab */}
        {activeTab === 'add' && (
          <div className="card max-w-lg">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--fc-navy)' }}>
              Add Manual Entry
            </h2>
            <form onSubmit={handleAddManualEntry} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input"
                  value={manualEntry.name}
                  onChange={(e) => setManualEntry({ ...manualEntry, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={manualEntry.email}
                  onChange={(e) => setManualEntry({ ...manualEntry, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  className="input"
                  value={manualEntry.phone}
                  onChange={(e) => setManualEntry({ ...manualEntry, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Amount (in dollars)</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  max="360"
                  value={manualEntry.amount}
                  onChange={(e) => setManualEntry({ ...manualEntry, amount: e.target.value })}
                  placeholder="Enter amount 1-360"
                  required
                />
              </div>

              {manualEntryError && <p className="error-message">{manualEntryError}</p>}

              <button type="submit" disabled={isAddingEntry} className="btn btn-primary w-full">
                {isAddingEntry ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding Entry...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Entry
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && settings && (
          <div className="card max-w-lg">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--fc-navy)' }}>
              Raffle Settings
            </h2>
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div>
                <label className="label">Campaign Name</label>
                <input
                  type="text"
                  className="input"
                  value={settings.campaignName}
                  onChange={(e) => setSettings({ ...settings, campaignName: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Prize Description</label>
                <input
                  type="text"
                  className="input"
                  value={settings.prizeDescription}
                  onChange={(e) => setSettings({ ...settings, prizeDescription: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Cash Value (in dollars)</label>
                <input
                  type="number"
                  className="input"
                  value={settings.cashValue / 100}
                  onChange={(e) =>
                    setSettings({ ...settings, cashValue: parseInt(e.target.value) * 100 })
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={settings.isActive}
                  onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="font-medium" style={{ color: 'var(--fc-navy)' }}>
                  Raffle is Active
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Save Settings
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
