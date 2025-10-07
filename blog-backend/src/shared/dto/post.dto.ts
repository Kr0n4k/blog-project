import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsArray, MinLength, MaxLength } from 'class-validator';

export class PostDto {
  @ApiProperty({
    description: 'Уникальный идентификатор поста',
    example: 'clx1234567890abcdef'
  })
  id: string;

  @ApiProperty({
    description: 'ID автора поста',
    example: 'clx1234567890abcdef'
  })
  userId: string;

  @ApiProperty({
    description: 'Заголовок поста',
    example: 'Мой первый пост в блоге',
    minLength: 5,
    maxLength: 200
  })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Текст поста',
    example: 'Это содержимое моего поста...',
    minLength: 10,
    maxLength: 5000
  })
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  text: string;

  @ApiProperty({
    description: 'Массив URL фотографий',
    example: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  photos: string[];

  @ApiProperty({
    description: 'Массив URL видео',
    example: ['https://example.com/video1.mp4'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  videos: string[];

  @ApiProperty({
    description: 'Дата создания поста',
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

export class CreatePostDto {
  @ApiProperty({
    description: 'Заголовок поста',
    example: 'Мой первый пост в блоге',
    minLength: 5,
    maxLength: 200
  })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Текст поста',
    example: 'Это содержимое моего поста...',
    minLength: 10,
    maxLength: 5000
  })
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  text: string;

  @ApiPropertyOptional({
    description: 'Массив URL фотографий',
    example: ['https://example.com/photo1.jpg'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @ApiPropertyOptional({
    description: 'Массив URL видео',
    example: ['https://example.com/video1.mp4'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];
}

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Заголовок поста',
    example: 'Обновленный заголовок',
    minLength: 5,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'Текст поста',
    example: 'Обновленное содержимое поста...',
    minLength: 10,
    maxLength: 5000
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  text?: string;

  @ApiPropertyOptional({
    description: 'Массив URL фотографий',
    example: ['https://example.com/photo1.jpg'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @ApiPropertyOptional({
    description: 'Массив URL видео',
    example: ['https://example.com/video1.mp4'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];
}
