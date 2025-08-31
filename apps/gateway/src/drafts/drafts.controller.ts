import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DraftsService } from './drafts.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { ApproveDraftDto } from './dto/approve-draft.dto';

@ApiTags('AI Drafts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('drafts')
export class DraftsController {
  constructor(private draftsService: DraftsService) {}

  @ApiOperation({ summary: 'Generate AI draft for case' })
  @Post()
  async createDraft(@Body() dto: CreateDraftDto, @Request() req) {
    return this.draftsService.createDraft(dto, req.user);
  }

  @ApiOperation({ summary: 'Get drafts for a case' })
  @Get('case/:caseId')
  async getCaseDrafts(@Param('caseId') caseId: string, @Request() req) {
    return this.draftsService.getCaseDrafts(caseId, req.user);
  }

  @ApiOperation({ summary: 'Approve draft for sending' })
  @Put(':id/approve')
  async approveDraft(@Param('id') id: string, @Body() dto: ApproveDraftDto, @Request() req) {
    return this.draftsService.approveDraft(id, dto, req.user);
  }
}