import { Injectable } from '@nestjs/common';
import { prisma } from '@travoy/database';
import { DashboardKPIs } from '@travoy/shared';

@Injectable()
export class DashboardService {
  async getDashboardKPIs(user: any): Promise<DashboardKPIs> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Base query filters based on user role
    const caseFilter = user.role === 'STAFF' 
      ? { assignedTo: user.id }
      : {}; // Admin/Super Admin see all

    const taskFilter = user.role === 'STAFF'
      ? { assigneeId: user.id }
      : {}; // Admin/Super Admin see all

    // Get case counts
    const totalCases = await prisma.case.count({ where: caseFilter });
    const activeCases = await prisma.case.count({
      where: {
        ...caseFilter,
        stage: {
          notIn: ['COMPLETED', 'REJECTED'],
        },
      },
    });

    const completedThisMonth = await prisma.case.count({
      where: {
        ...caseFilter,
        stage: 'COMPLETED',
        updatedAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get revenue data
    const thisMonthInvoices = await prisma.invoice.aggregate({
      where: {
        status: 'PAID',
        paidAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const lastMonthInvoices = await prisma.invoice.aggregate({
      where: {
        status: 'PAID',
        paidAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const thisMonthRevenue = Number(thisMonthInvoices._sum.amount || 0);
    const lastMonthRevenue = Number(lastMonthInvoices._sum.amount || 0);
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Get task counts
    const pendingTasks = await prisma.task.count({
      where: {
        ...taskFilter,
        status: 'PENDING',
      },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        ...taskFilter,
        status: 'PENDING',
        dueAt: {
          lt: now,
        },
      },
    });

    const completedTasks = await prisma.task.count({
      where: {
        ...taskFilter,
        status: 'COMPLETED',
        updatedAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get pipeline data
    const pipelineData = await prisma.case.groupBy({
      by: ['stage'],
      where: caseFilter,
      _count: {
        stage: true,
      },
    });

    const pipeline = pipelineData.map(item => ({
      stage: item.stage,
      count: item._count.stage,
    }));

    return {
      totalCases,
      activeCases,
      completedThisMonth,
      revenue: {
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        growth: Math.round(revenueGrowth * 100) / 100,
      },
      tasks: {
        pending: pendingTasks,
        overdue: overdueTasks,
        completed: completedTasks,
      },
      pipeline,
    };
  }
}