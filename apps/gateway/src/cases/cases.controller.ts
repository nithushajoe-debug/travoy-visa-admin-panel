import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CasesQueryDto } from './dto/cases-query.dto';

@ApiTags('Cases')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @ApiOperation({ summary: 'Get all cases with filtering' })
  @Get()
  async getCases(@Query() query: CasesQueryDto, @Request() req) {
    return this.casesService.getCases(query, req.user);
  }

  @ApiOperation({ summary: 'Get case by ID' })
  @Get(':id')
  async getCase(@Param('id') id: string, @Request() req) {
    return this.casesService.getCase(id, req.user);
  }

  @ApiOperation({ summary: 'Create new case' })
  @Post()
  async createCase(@Body() createCaseDto: CreateCaseDto, @Request() req) {
    return this.casesService.createCase(createCaseDto, req.user);
  }

  @ApiOperation({ summary: 'Update case' })
  @Put(':id')
  async updateCase(
    @Param('id') id: string,
    @Body() updateCaseDto: UpdateCaseDto,
    @Request() req,
  ) {
    return this.casesService.updateCase(id, updateCaseDto, req.user);
  }

  @ApiOperation({ summary: 'Delete case' })
  @Delete(':id')
  async deleteCase(@Param('id') id: string, @Request() req) {
    return this.casesService.deleteCase(id, req.user);
  }
}