import { ApiPropertyOptional} from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateMyInfoDto {
  @ApiPropertyOptional({ description: '새 닉네임', example: 'new_nickname' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: '닉네임은 최소 3자 이상이어야 합니다.' })
  nickname?: string;  

  @ApiPropertyOptional({ description: '새 프로필 이미지 URL', example: 'http://example.com/new-profile.jpg' })
  @IsOptional()
  @IsString()
  profileImage?: string;
}