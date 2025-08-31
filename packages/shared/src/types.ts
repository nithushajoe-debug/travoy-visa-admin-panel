import { z } from 'zod';

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard KPIs
export interface DashboardKPIs {
  totalCases: number;
  activeCases: number;
  completedThisMonth: number;
  revenue: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  tasks: {
    pending: number;
    overdue: number;
    completed: number;
  };
  pipeline: {
    stage: string;
    count: number;
  }[];
}

// Case creation/update schemas
export const CreateCaseSchema = z.object({
  contactId: z.string(),
  visaType: z.string(),
  country: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional(),
  dueAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const UpdateCaseSchema = CreateCaseSchema.partial();

// Document upload schema
export const DocumentUploadSchema = z.object({
  caseId: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number().max(50 * 1024 * 1024), // 50MB max
});

// AI Draft schema
export const CreateDraftSchema = z.object({
  caseId: z.string(),
  type: z.enum(['COVER_LETTER', 'INVITATION_LETTER', 'CLARIFICATION_LETTER', 'EMAIL', 'SOP']),
  prompt: z.string(),
  tone: z.enum(['FORMAL', 'EMBASSY', 'FRIENDLY', 'PERSUASIVE']).optional(),
});

// Message schemas
export const SendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  bodyMd: z.string(),
  caseId: z.string().optional(),
  templateId: z.string().optional(),
  variables: z.record(z.string()).optional(),
});

export const SendWhatsAppSchema = z.object({
  to: z.string(),
  templateName: z.string(),
  variables: z.array(z.string()),
  caseId: z.string().optional(),
});

// Permissions
export const PERMISSIONS = {
  // Cases
  CASES_VIEW_ALL: 'cases:view:all',
  CASES_VIEW_ASSIGNED: 'cases:view:assigned',
  CASES_CREATE: 'cases:create',
  CASES_EDIT: 'cases:edit',
  CASES_DELETE: 'cases:delete',
  
  // Documents
  DOCS_VIEW: 'docs:view',
  DOCS_UPLOAD: 'docs:upload',
  DOCS_DELETE: 'docs:delete',
  
  // AI
  AI_GENERATE_DRAFTS: 'ai:generate:drafts',
  AI_APPROVE_DRAFTS: 'ai:approve:drafts',
  
  // Messaging
  MSG_SEND_EMAIL: 'msg:send:email',
  MSG_SEND_WHATSAPP: 'msg:send:whatsapp',
  MSG_VIEW_TEMPLATES: 'msg:view:templates',
  MSG_EDIT_TEMPLATES: 'msg:edit:templates',
  
  // Accounting
  ACCT_VIEW_INVOICES: 'acct:view:invoices',
  ACCT_CREATE_INVOICES: 'acct:create:invoices',
  ACCT_MARK_PAID: 'acct:mark:paid',
  
  // Admin
  ADMIN_USERS: 'admin:users',
  ADMIN_SETTINGS: 'admin:settings',
  ADMIN_AUDIT: 'admin:audit',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.CASES_VIEW_ALL,
    PERMISSIONS.CASES_CREATE,
    PERMISSIONS.CASES_EDIT,
    PERMISSIONS.DOCS_VIEW,
    PERMISSIONS.DOCS_UPLOAD,
    PERMISSIONS.AI_GENERATE_DRAFTS,
    PERMISSIONS.AI_APPROVE_DRAFTS,
    PERMISSIONS.MSG_SEND_EMAIL,
    PERMISSIONS.MSG_SEND_WHATSAPP,
    PERMISSIONS.MSG_VIEW_TEMPLATES,
    PERMISSIONS.MSG_EDIT_TEMPLATES,
    PERMISSIONS.ACCT_VIEW_INVOICES,
    PERMISSIONS.ACCT_CREATE_INVOICES,
    PERMISSIONS.ACCT_MARK_PAID,
    PERMISSIONS.ADMIN_USERS,
  ],
  STAFF: [
    PERMISSIONS.CASES_VIEW_ASSIGNED,
    PERMISSIONS.CASES_CREATE,
    PERMISSIONS.CASES_EDIT,
    PERMISSIONS.DOCS_VIEW,
    PERMISSIONS.DOCS_UPLOAD,
    PERMISSIONS.AI_GENERATE_DRAFTS,
    PERMISSIONS.MSG_SEND_EMAIL,
    PERMISSIONS.MSG_SEND_WHATSAPP,
    PERMISSIONS.MSG_VIEW_TEMPLATES,
    PERMISSIONS.ACCT_VIEW_INVOICES,
  ],
  CUSTOMER: [
    PERMISSIONS.CASES_VIEW_ASSIGNED,
    PERMISSIONS.DOCS_VIEW,
    PERMISSIONS.DOCS_UPLOAD,
  ],
};