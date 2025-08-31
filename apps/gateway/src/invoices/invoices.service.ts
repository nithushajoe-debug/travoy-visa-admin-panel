import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { prisma } from '@travoy/database';
import { PERMISSIONS } from '@travoy/shared';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';

@Injectable()
export class InvoicesService {
  async getInvoices(query: any, user: any) {
    if (!user.permissions.includes(PERMISSIONS.ACCT_VIEW_INVOICES)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const invoices = await prisma.invoice.findMany({
      include: {
        case: {
          include: {
            contact: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit || 50,
      skip: query.offset || 0,
    });

    return invoices;
  }

  async getInvoice(id: string, user: any) {
    if (!user.permissions.includes(PERMISSIONS.ACCT_VIEW_INVOICES)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        case: {
          include: {
            contact: true,
          },
        },
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async createInvoice(dto: CreateInvoiceDto, user: any) {
    if (!user.permissions.includes(PERMISSIONS.ACCT_CREATE_INVOICES)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Generate invoice number
    const count = await prisma.invoice.count();
    const number = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        ...dto,
        number,
        issuedAt: new Date(),
      },
      include: {
        case: {
          include: {
            contact: true,
          },
        },
      },
    });

    // Log activity if linked to case
    if (dto.caseId) {
      await prisma.activity.create({
        data: {
          caseId: dto.caseId,
          type: 'NOTE',
          title: 'Invoice created',
          content: `Invoice ${number} created for £${dto.amount}`,
          createdBy: user.id,
        },
      });
    }

    return invoice;
  }

  async markPaid(id: string, dto: MarkPaidDto, user: any) {
    if (!user.permissions.includes(PERMISSIONS.ACCT_MARK_PAID)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Update invoice status
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        invoiceId: id,
        amount: dto.amount,
        method: dto.method,
        txRef: dto.txRef,
      },
    });

    // Log activity if linked to case
    if (invoice.caseId) {
      await prisma.activity.create({
        data: {
          caseId: invoice.caseId,
          type: 'PAYMENT_RECEIVED',
          title: 'Payment received',
          content: `Payment of £${dto.amount} received for ${invoice.number}`,
          createdBy: user.id,
        },
      });
    }

    return updatedInvoice;
  }
}