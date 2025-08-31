import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateDraftDto {
  @ApiProperty()
  @IsString()
  caseId: string;

  @ApiProperty({ enum: ['COVER_LETTER', 'INVITATION_LETTER', 'CLARIFICATION_LETTER', 'EMAIL', 'SOP'] })
  @IsEnum(['COVER_LETTER', 'INVITATION_LETTER', 'CLARIFICATION_LETTER', 'EMAIL', 'SOP'])
  type: string;

  @ApiProperty({ description: 'Prompt for AI generation' })
  @IsString()
  prompt: string;

  @ApiProperty({ enum: ['FORMAL', 'EMBASSY', 'FRIENDLY', 'PERSUASIVE'], required: false })
  @IsOptional()
  @IsEnum(['FORMAL', 'EMBASSY', 'FRIENDLY', 'PERSUASIVE'])
  tone?: string;
}