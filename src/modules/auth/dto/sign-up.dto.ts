// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'ae@aespa.com'})
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'test1234'})
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'MY'})
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ example: 'KMY'})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
