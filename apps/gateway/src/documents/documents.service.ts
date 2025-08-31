import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { prisma } from '@travoy/database';
import { PERMISSIONS } from '@travoy/shared';
import { CreateSignedUrlDto } from './dto/create-signed-url.dto';

@Injectable()
export class DocumentsService {
  async createSignedUrl(dto: CreateSignedUrlDto, user: any) {
    if (!user.permissions.includes(PERMISSIONS.DOCS_UPLOAD)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Verify user can access the case
    const caseData = await this.verifyCaseAccess(dto.caseId, user);

    // Generate signed URL (stub implementation)
    const key = `cases/${dto.caseId}/${Date.now()}-${dto.filename}`;
    const signedUrl = `http://localhost:9000/travoy-docs/${key}?X-Amz-Expires=3600`;

    // Create document record
    const document = await prisma.document.create({
      data: {
        caseId: dto.caseId,
        filename: dto.filename,
        mimeType: dto.mimeType,
        url: key,
        size: dto.size,
        uploadedBy: user.id,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        caseId: dto.caseId,
        type: 'DOCUMENT_UPLOAD',
        title: 'Document uploaded',
        content: `${dto.filename} uploaded`,
        createdBy: user.id,
      },
    });

    return {
      signedUrl,
      document,
    };
  }

  async getCaseDocuments(caseId: string, user: any) {
    if (!user.permissions.includes(PERMISSIONS.DOCS_VIEW)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Verify user can access the case
    await this.verifyCaseAccess(caseId, user);

    const documents = await prisma.document.findMany({
      where: { caseId },
      orderBy: { createdAt: 'desc' },
    });

    return documents;
  }

  async deleteDocument(id: string, user: any) {
    if (!user.permissions.includes(PERMISSIONS.DOCS_DELETE)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const document = await prisma.document.findUnique({
      where: { id },
      include: { case: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Verify user can access the case
    await this.verifyCaseAccess(document.caseId, user);

    await prisma.document.delete({
      where: { id },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        caseId: document.caseId,
        type: 'NOTE',
        title: 'Document deleted',
        content: `${document.filename} was deleted`,
        createdBy: user.id,
      },
    });

    return { success: true };
  }

  private async verifyCaseAccess(caseId: string, user: any) {
    const canViewAll = user.permissions.includes(PERMISSIONS.CASES_VIEW_ALL);
    
    const where: any = { id: caseId };
    
    if (!canViewAll) {
      where.assignedTo = user.id;
    }

    const caseData = await prisma.case.findFirst({
      where,
      select: { id: true },
    });

    if (!caseData) {
      throw new NotFoundException('Case not found or access denied');
    }

    return caseData;
  }
}