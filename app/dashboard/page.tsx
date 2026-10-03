"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Ticket = {
  id: string;
  inSystemNumber: number;
  clientPlatformId: string;
  actualTicketReference: string;
  ticketType: string;
  regulatoryOrganization: string;
  status: 'OPEN' | 'SOLVED' | 'SECONDARY_REVIEW' | 'CLOSED';
  createdAt: string;
  createdBy: { name: string };
};

const statusColors: Record<string, string> = {
  OPEN: 'status-open',
  SOLVED: 'status-solved',
  SECONDARY_REVIEW: 'status-review',
  CLOSED: 'status-closed',
};

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState('ADMIN');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const currentRole = localStorage.getItem('cfi-role') ?? 'ADMIN';
    setRole(currentRole);

    fetch('/api/tickets')
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch(() => setTickets([]));
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const query = search.toLowerCase();
      return (
        !query ||
        ticket.actualTicketReference.toLowerCase().includes(query) ||
        ticket.clientPlatformId.toLowerCase().includes(query) ||
        ticket.ticketType.toLowerCase().includes(query) ||
        String(ticket.inSystemNumber).includes(query)
      );
    });
  }, [tickets, search]);

  const stats = useMemo(() => {
    return {
      open: tickets.filter((t) => t.status === 'OPEN').length,
      solved: tickets.filter((t) => t.status === 'SOLVED').length,
      review: tickets.filter((t) => t.status === 'SECONDARY_REVIEW').length,
      closed: tickets.filter((t) => t.status === 'CLOSED').length,
    };
  }, [tickets]);

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">CFI</div>
          <div>
            <strong>CFI Ticketing Tracker</strong>
            <small>Operations Panel</small>
          </div>
        </div>

        <nav className="nav-stack">
          <button className="nav-button active" type="button">Tickets Overview</button>
          <button className="nav-button" type="button">Reports</button>
          <button className="nav-button" type="button">User Management</button>
          <button className="nav-button" type="button">System Settings</button>
          <button className="nav-button" type="button">Import Existing Tickets</button>
          <button className="nav-button" type="button">Ticket Form Builder</button>
        </nav>

        <div className="sidebar-footer">
          <span>Active role</span>
          <strong>{role}</strong>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <div className="eyebrow">Dashboard</div>
            <h1>Tickets Overview</h1>
          </div>
          <button className="primary-button" type="button" onClick={() => router.push('/tickets/new')}>
            + Add Ticket
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card navy">
            <span>Open</span>
            <strong>{stats.open}</strong>
          </div>
          <div className="stat-card gold">
            <span>Solved</span>
            <strong>{stats.solved}</strong>
          </div>
          <div className="stat-card orange">
            <span>Secondary Review</span>
            <strong>{stats.review}</strong>
          </div>
          <div className="stat-card gray">
            <span>Closed</span>
            <strong>{stats.closed}</strong>
          </div>
        </section>

        <section className="panel-card">
          <div className="panel-header">
            <h2>Ticket list</h2>
            <div className="inline-search">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ticket or client ID"
              />
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Client ID</th>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Organization</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} onClick={() => router.push(`/tickets/${ticket.id}`)} className="clickable-row">
                    <td>{ticket.inSystemNumber}</td>
                    <td>{ticket.clientPlatformId}</td>
                    <td>{ticket.actualTicketReference}</td>
                    <td>{ticket.ticketType}</td>
                    <td>{ticket.regulatoryOrganization}</td>
                    <td>
                      <span className={`status-pill ${statusColors[ticket.status]}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
