import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  caseId?: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ default: 'GBP' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}