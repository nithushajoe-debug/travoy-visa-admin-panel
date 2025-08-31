import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class SendWhatsAppDto {
  @ApiProperty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsString()
  templateName: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  variables: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  caseId?: string;
}