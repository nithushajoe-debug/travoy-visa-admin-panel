import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateSignedUrlDto } from './dto/create-signed-url.dto';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @ApiOperation({ summary: 'Get signed URL for document upload' })
  @Post('sign-upload')
  async createSignedUrl(@Body() dto: CreateSignedUrlDto, @Request() req) {
    return this.documentsService.createSignedUrl(dto, req.user);
  }

  @ApiOperation({ summary: 'Get documents for a case' })
  @Get('case/:caseId')
  async getCaseDocuments(@Param('caseId') caseId: string, @Request() req) {
    return this.documentsService.getCaseDocuments(caseId, req.user);
  }

  @ApiOperation({ summary: 'Delete document' })
  @Delete(':id')
  async deleteDocument(@Param('id') id: string, @Request() req) {
    return this.documentsService.deleteDocument(id, req.user);
  }
}