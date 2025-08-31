import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Max } from 'class-validator';

export class CreateSignedUrlDto {
  @ApiProperty()
  @IsString()
  caseId: string;

  @ApiProperty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsString()
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes', maximum: 50 * 1024 * 1024 })
  @IsNumber()
  @Max(50 * 1024 * 1024) // 50MB max
  size: number;
}