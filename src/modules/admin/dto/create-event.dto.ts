import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDateString()
  startTime: string; // Date로 저장할 예정, 문자열로 받아서 변환

  @ApiProperty()
  @IsDateString()
  endTime: string;
}
