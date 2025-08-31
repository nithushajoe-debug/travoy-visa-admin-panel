import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query,
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @ApiOperation({ summary: 'Get all invoices' })
  @Get()
  async getInvoices(@Query() query: any, @Request() req) {
    return this.invoicesService.getInvoices(query, req.user);
  }

  @ApiOperation({ summary: 'Get invoice by ID' })
  @Get(':id')
  async getInvoice(@Param('id') id: string, @Request() req) {
    return this.invoicesService.getInvoice(id, req.user);
  }

  @ApiOperation({ summary: 'Create new invoice' })
  @Post()
  async createInvoice(@Body() dto: CreateInvoiceDto, @Request() req) {
    return this.invoicesService.createInvoice(dto, req.user);
  }

  @ApiOperation({ summary: 'Mark invoice as paid' })
  @Put(':id/mark-paid')
  async markPaid(@Param('id') id: string, @Body() dto: MarkPaidDto, @Request() req) {
    return this.invoicesService.markPaid(id, dto, req.user);
  }
}