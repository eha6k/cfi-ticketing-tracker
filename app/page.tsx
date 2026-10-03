"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const userRoles = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Team Lead', value: 'TEAM_LEAD' },
  { label: 'Agent', value: 'AGENT' },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('ADMIN');

  useEffect(() => {
    const existing = localStorage.getItem('cfi-role');
    if (existing) router.push('/dashboard');
  }, [router]);

  const handleContinue = () => {
    localStorage.setItem('cfi-role', selectedRole);
    router.push('/dashboard');
  };

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="brand-row">
          <div className="brand-mark">CFI</div>
          <div>
            <div className="brand-label">CFI Ticketing Tracker</div>
            <div className="brand-subtitle">Support operations dashboard</div>
          </div>
        </div>

        <h1>Welcome back</h1>
        <p className="muted">Select your role to continue.</p>

        <div className="role-grid">
          {userRoles.map((role) => (
            <button
              key={role.value}
              type="button"
              className={`role-option ${selectedRole === role.value ? 'active' : ''}`}
              onClick={() => setSelectedRole(role.value)}
            >
              {role.label}
            </button>
          ))}
        </div>

        <button type="button" className="primary-button full" onClick={handleContinue}>
          Continue to dashboard
        </button>
      </div>
    </main>
  );
}
