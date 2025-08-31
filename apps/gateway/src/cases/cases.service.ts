import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { prisma } from '@travoy/database';
import { PERMISSIONS } from '@travoy/shared';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CasesQueryDto } from './dto/cases-query.dto';

@Injectable()
export class CasesService {
  async getCases(query: CasesQueryDto, user: any) {
    // Check permissions
    const canViewAll = user.permissions.includes(PERMISSIONS.CASES_VIEW_ALL);
    const canViewAssigned = user.permissions.includes(PERMISSIONS.CASES_VIEW_ASSIGNED);

    if (!canViewAll && !canViewAssigned) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Build where clause
    const where: any = {};
    
    if (!canViewAll && canViewAssigned) {
      // Staff can only see assigned cases
      where.assignedTo = user.id;
    }

    if (query.stage) {
      where.stage = query.stage;
    }

    if (query.country) {
      where.country = query.country;
    }

    if (query.assignee) {
      where.assignedTo = query.assignee;
    }

    const cases = await prisma.case.findMany({
      where,
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        assignee: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            documents: true,
            activities: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: query.limit || 50,
      skip: query.offset || 0,
    });

    const total = await prisma.case.count({ where });

    return {
      cases,
      total,
      hasMore: (query.offset || 0) + cases.length < total,
    };
  }

  async getCase(id: string, user: any) {
    const canViewAll = user.permissions.includes(PERMISSIONS.CASES_VIEW_ALL);
    const canViewAssigned = user.permissions.includes(PERMISSIONS.CASES_VIEW_ASSIGNED);

    if (!canViewAll && !canViewAssigned) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const where: any = { id };
    
    if (!canViewAll && canViewAssigned) {
      where.assignedTo = user.id;
    }

    const caseData = await prisma.case.findFirst({
      where,
      include: {
        contact: true,
        assignee: {
          select: {
            name: true,
            email: true,
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            dueAt: 'asc',
          },
        },
        documents: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        activities: {
          include: {
            creator: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
        drafts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        invoices: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!caseData) {
      throw new NotFoundException('Case not found');
    }

    return caseData;
  }

  async createCase(createCaseDto: CreateCaseDto, user: any) {
    if (!user.permissions.includes(PERMISSIONS.CASES_CREATE)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const caseData = await prisma.case.create({
      data: {
        ...createCaseDto,
        assignedTo: createCaseDto.assignedTo || user.id,
      },
      include: {
        contact: true,
        assignee: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Create initial activity
    await prisma.activity.create({
      data: {
        caseId: caseData.id,
        type: 'NOTE',
        title: 'Case created',
        content: `Case created for ${caseData.visaType} to ${caseData.country}`,
        createdBy: user.id,
      },
    });

    return caseData;
  }

  async updateCase(id: string, updateCaseDto: UpdateCaseDto, user: any) {
    if (!user.permissions.includes(PERMISSIONS.CASES_EDIT)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Check if user can access this case
    const existingCase = await this.getCase(id, user);

    const updatedCase = await prisma.case.update({
      where: { id },
      data: updateCaseDto,
      include: {
        contact: true,
        assignee: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Log the update
    await prisma.activity.create({
      data: {
        caseId: id,
        type: 'STATUS_CHANGE',
        title: 'Case updated',
        content: `Case details updated`,
        createdBy: user.id,
        payload: updateCaseDto,
      },
    });

    return updatedCase;
  }

  async deleteCase(id: string, user: any) {
    if (!user.permissions.includes(PERMISSIONS.CASES_DELETE)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Check if user can access this case
    await this.getCase(id, user);

    await prisma.case.delete({
      where: { id },
    });

    return { success: true };
  }
}