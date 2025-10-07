import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
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
  ApiBody,
  ApiQuery
} from '@nestjs/swagger';
import { PostService } from '../user/post/post.service';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { 
  PostDto, 
  CreatePostDto, 
  UpdatePostDto 
} from '../../shared/dto/post.dto';

@ApiTags('Posts')
@Controller('api/posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Получить список постов',
    description: 'Возвращает список всех постов с пагинацией'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Номер страницы',
    example: 1,
    type: Number
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Количество постов на странице',
    example: 10,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список постов',
    schema: {
      type: 'object',
      properties: {
        posts: {
          type: 'array',
          items: { $ref: '#/components/schemas/PostDto' }
        },
        total: { type: 'number', example: 25 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 }
      }
    }
  })
  async getPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    // return this.postService.findAll({ page, limit });
    return { message: 'Get posts endpoint - requires implementation' };
  }

  @Get('random')
  @ApiOperation({ 
    summary: 'Получить случайные посты',
    description: 'Возвращает случайную выборку постов'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Количество постов',
    example: 5,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список случайных постов',
    type: [PostDto]
  })
  async getRandomPosts(@Query('limit') limit: number = 5) {
    return this.postService.getRandomPosts(limit);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить пост по ID',
    description: 'Возвращает детальную информацию о посте'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID поста',
    example: 'clx1234567890abcdef'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные поста',
    type: PostDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Пост не найден' 
  })
  async getPostById(@Param('id') id: string) {
    return this.postService.findById(id);
  }

  @Post()
  @UseGuards(GqlAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('session')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Создать новый пост',
    description: 'Создает новый пост в системе'
  })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Пост успешно создан',
    type: PostDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные поста' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.create(createPostDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(GqlAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('session')
  @ApiOperation({ 
    summary: 'Обновить пост',
    description: 'Обновляет существующий пост (только автор)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID поста',
    example: 'clx1234567890abcdef'
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Пост обновлен',
    type: PostDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав на редактирование поста' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Пост не найден' 
  })
  async updatePost(
    @Param('id') id: string, 
    @Body() updatePostDto: UpdatePostDto, 
    @Request() req
  ) {
    return this.postService.update(id, updatePostDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(GqlAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('session')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Удалить пост',
    description: 'Удаляет пост (только автор)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID поста',
    example: 'clx1234567890abcdef'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Пост удален' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав на удаление поста' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Пост не найден' 
  })
  async deletePost(@Param('id') id: string, @Request() req) {
    return this.postService.remove(id, req.user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Получить посты пользователя',
    description: 'Возвращает все посты конкретного пользователя'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'ID пользователя',
    example: 'clx1234567890abcdef'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Номер страницы',
    example: 1,
    type: Number
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Количество постов на странице',
    example: 10,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Посты пользователя',
    type: [PostDto]
  })
  async getUserPosts(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.postService.findByUserId(userId, { page, limit });
  }
}
