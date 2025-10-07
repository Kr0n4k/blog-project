import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiCookieAuth,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { AccountService } from '../user/auth/account/account.service';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { 
  UserDto, 
  CreateUserDto, 
  UpdateUserDto, 
  LoginDto 
} from '../../shared/dto/user.dto';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Регистрация нового пользователя',
    description: 'Создает новый аккаунт пользователя в системе'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Пользователь успешно зарегистрирован',
    type: UserDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные пользователя' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Пользователь с таким email или именем уже существует' 
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.accountService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Вход в систему',
    description: 'Аутентификация пользователя и создание сессии'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Успешная аутентификация',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Login successful' },
        user: { $ref: '#/components/schemas/UserDto' },
        session: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'session_id_123' },
            userId: { type: 'string', example: 'clx1234567890abcdef' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Неверные учетные данные' 
  })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    // Здесь должен быть вызов сервиса аутентификации
    // return this.authService.login(loginDto, req);
    return { message: 'Login endpoint - requires implementation' };
  }

  @Get('me')
  @UseGuards(GqlAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('session')
  @ApiOperation({ 
    summary: 'Получить информацию о текущем пользователе',
    description: 'Возвращает данные авторизованного пользователя'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные пользователя',
    type: UserDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  async getCurrentUser(@Request() req) {
    return this.accountService.me(req.user.id);
  }

  @Put('me')
  @UseGuards(GqlAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('session')
  @ApiOperation({ 
    summary: 'Обновить данные пользователя',
    description: 'Обновляет информацию о текущем пользователе'
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные пользователя обновлены',
    type: UserDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    // return this.accountService.update(req.user.id, updateUserDto);
    return { message: 'Update user endpoint - requires implementation' };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить пользователя по ID',
    description: 'Возвращает публичную информацию о пользователе'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID пользователя',
    example: 'clx1234567890abcdef'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные пользователя',
    type: UserDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Пользователь не найден' 
  })
  async getUserById(@Param('id') id: string) {
    return this.accountService.findById(id);
  }

  @Post('logout')
  @UseGuards(GqlAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Выход из системы',
    description: 'Завершает сессию пользователя'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Успешный выход из системы',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Logout successful' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  async logout(@Request() req) {
    // return this.authService.logout(req);
    return { message: 'Logout endpoint - requires implementation' };
  }
}
