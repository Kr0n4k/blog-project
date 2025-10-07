import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, MinLength, MaxLength } from 'class-validator';

export class CommentDto {
  @ApiProperty({
    description: 'Уникальный идентификатор комментария',
    example: 'clx1234567890abcdef'
  })
  id: string;

  @ApiProperty({
    description: 'ID автора комментария',
    example: 'clx1234567890abcdef'
  })
  userId: string;

  @ApiProperty({
    description: 'ID поста',
    example: 'clx1234567890abcdef'
  })
  postId: string;

  @ApiProperty({
    description: 'Текст комментария',
    example: 'Отличный пост! Спасибо за информацию.',
    minLength: 1,
    maxLength: 1000
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text: string;

  @ApiProperty({
    description: 'Дата создания комментария',
    example: '2024-01-15T10:30:00Z'
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-15T10:30:00Z'
  })
  @IsDateString()
  updatedAt: Date;
}

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID поста',
    example: 'clx1234567890abcdef'
  })
  @IsString()
  postId: string;

  @ApiProperty({
    description: 'Текст комментария',
    example: 'Отличный пост! Спасибо за информацию.',
    minLength: 1,
    maxLength: 1000
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text: string;
}

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Текст комментария',
    example: 'Обновленный комментарий',
    minLength: 1,
    maxLength: 1000
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text: string;
}
