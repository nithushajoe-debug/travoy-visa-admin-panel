# Travoy ERP - Visa Consultation Management System

A comprehensive ERP system for visa consultation businesses with advanced AI agent capabilities.

## 🚀 Features

- **Role-based Access Control** (Super Admin, Admin, Staff, Customer)
- **Case Management** with automated workflows
- **AI-powered Letter & Email Generation**
- **Document Management** with OCR and virus scanning
- **Multi-channel Messaging** (Email + WhatsApp)
- **Accounting & Invoicing**
- **Real-time Dashboard** with KPIs
- **Audit Logging** and compliance features

## 🏗️ Architecture

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** NestJS microservices with NATS message bus
- **Database:** PostgreSQL with Prisma ORM
- **Cache & Queues:** Redis + BullMQ
- **File Storage:** MinIO (S3-compatible)
- **AI:** OpenAI GPT-4 integration

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- pnpm 8+

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repo-url>
   cd travoy-erp
   make setup
   ```

2. **Start infrastructure:**
   ```bash
   make docker-up
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and settings
   ```

4. **Run database migrations:**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start development servers:**
   ```bash
   make dev
   ```

### Access Points

- **Frontend:** http://localhost:3000
- **API Gateway:** http://localhost:3001
- **API Docs:** http://localhost:3001/api/docs
- **MinIO Console:** http://localhost:9001 (minio/minio123)

### Demo Accounts

- **Super Admin:** admin@travoy.com
- **Admin:** manager@travoy.com  
- **Staff:** consultant@travoy.com

*Password: Use any password for demo (authentication is simplified)*

## 📁 Project Structure

```
travoy-erp/
├── apps/
│   ├── frontend/          # Next.js frontend
│   ├── gateway/           # API Gateway (NestJS)
│   ├── auth-svc/          # Authentication service
│   ├── crm-svc/           # CRM & case management
│   ├── doc-svc/           # Document management
│   ├── ai-svc/            # AI agent service
│   ├── msg-svc/           # Messaging service
│   ├── acct-svc/          # Accounting service
│   └── analytics-svc/     # Analytics & reporting
├── packages/
│   ├── database/          # Prisma schema & migrations
│   └── shared/            # Shared types & utilities
└── docker-compose.yml     # Infrastructure services
```

## 🔐 Security Features

- JWT-based authentication with role permissions
- Row-level security based on user assignments
- Input validation and sanitization
- File upload virus scanning (configurable)
- Audit logging for all critical actions
- Rate limiting for external API calls

## 🤖 AI Agent Capabilities

The AI agent can generate:

- **Cover Letters** for visa applications
- **Invitation Letters** from sponsors
- **Clarification Letters** for embassy requests
- **Email Templates** for client communication
- **Document Checklists** by visa type and country

All AI-generated content requires human review before external sending.

## 📊 Dashboard & Analytics

Role-specific dashboards showing:

- Case pipeline and conversion rates
- Revenue metrics (MRR/ARR)
- Task management with SLA tracking
- Staff performance indicators
- Client communication history

## 🔧 Development

### Available Commands

```bash
make setup          # Initial setup
make dev            # Start development
make build          # Build all apps
make test           # Run tests
make lint           # Lint code
make docker-up      # Start infrastructure
make docker-down    # Stop infrastructure
make reset-db       # Reset database
```

### Adding New Features

1. **Database changes:** Update `packages/database/prisma/schema.prisma`
2. **API endpoints:** Add to appropriate service in `apps/`
3. **Frontend pages:** Add to `apps/frontend/app/`
4. **Shared types:** Update `packages/shared/src/types.ts`

### Testing

```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:e2e

# Test specific service
cd apps/gateway && pnpm test
```

## 🚀 Deployment

### Production Setup

1. **Environment Variables:** Configure production values in `.env`
2. **Database:** Set up managed PostgreSQL instance
3. **Redis:** Configure Redis cluster
4. **Object Storage:** Set up S3 or compatible service
5. **Email/WhatsApp:** Configure provider credentials

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 API Documentation

Interactive API documentation is available at `/api/docs` when running the gateway service.

Key endpoints:

- `POST /auth/login` - Authentication
- `GET /dashboard` - Dashboard KPIs
- `GET /cases` - List cases
- `POST /cases` - Create case
- `POST /drafts` - Generate AI draft
- `POST /messages/email/send` - Send email
- `POST /documents/sign-upload` - Upload documents

## 🔌 Integrations

### WhatsApp Business Cloud API

1. Set up Meta Business account
2. Create WhatsApp Business app
3. Configure webhook endpoints
4. Add phone number and get access token
5. Create and approve message templates

### Email Providers

Supported SMTP providers:
- SendGrid
- Amazon SES  
- Mailgun
- Custom SMTP

### AI Providers

- OpenAI GPT-4 (primary)
- Anthropic Claude (configurable)
- Custom AI endpoints

## 🆘 Support

For technical support or feature requests:

1. Check the API documentation
2. Review the audit logs for errors
3. Check service health endpoints
4. Contact the development team

## 📄 License

Proprietary - All rights reserved