import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsDateString, MinLength, MaxLength } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: 'clx1234567890abcdef'
  })
  id: string;

  @ApiProperty({
    description: 'Имя пользователя (уникальное)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 30
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  userName: string;

  @ApiProperty({
    description: 'Email адрес пользователя',
    example: 'john@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'John',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Doe',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({
    description: 'URL аватара пользователя',
    example: 'https://example.com/avatar.jpg'
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Биография пользователя',
    example: 'Люблю программирование и путешествия',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({
    description: 'Дата создания аккаунта',
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

export class CreateUserDto {
  @ApiProperty({
    description: 'Имя пользователя (уникальное)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 30
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  userName: string;

  @ApiProperty({
    description: 'Email адрес пользователя',
    example: 'john@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'SecurePassword123!',
    minLength: 8
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'John',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Doe',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({
    description: 'URL аватара пользователя',
    example: 'https://example.com/avatar.jpg'
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Биография пользователя',
    example: 'Люблю программирование и путешествия',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Логин (email или имя пользователя)',
    example: 'john@example.com'
  })
  @IsString()
  login: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'SecurePassword123!'
  })
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Имя пользователя',
    example: 'John',
    minLength: 2,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Фамилия пользователя',
    example: 'Doe',
    minLength: 2,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'URL аватара пользователя',
    example: 'https://example.com/avatar.jpg'
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Биография пользователя',
    example: 'Люблю программирование и путешествия',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
