import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class MarkPaidDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'bank_transfer' })
  @IsString()
  method: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  txRef?: string;
}