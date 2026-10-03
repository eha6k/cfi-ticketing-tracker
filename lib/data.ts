import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDashboardStats() {
  const [total, open, solved, review, closed] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: 'OPEN' } }),
    prisma.ticket.count({ where: { status: 'SOLVED' } }),
    prisma.ticket.count({ where: { status: 'SECONDARY_REVIEW' } }),
    prisma.ticket.count({ where: { status: 'CLOSED' } }),
  ]);

  return { total, open, solved, review, closed };
}

export async function getTickets() {
  return prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
    include: { createdBy: true },
  });
}

export async function getTicketById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy: true,
      comments: { include: { user: true } },
      history: { include: { user: true } },
    },
  });
}
