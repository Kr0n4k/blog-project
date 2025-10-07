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
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { 
  CommentDto, 
  CreateCommentDto, 
  UpdateCommentDto 
} from '../../shared/dto/comment.dto';

@ApiTags('Comments')
@Controller('api/comments')
export class CommentsController {
  // constructor(private readonly commentService: CommentService) {}

  @Get('post/:postId')
  @ApiOperation({ 
    summary: 'Получить комментарии к посту',
    description: 'Возвращает все комментарии к конкретному посту'
  })
  @ApiParam({ 
    name: 'postId', 
    description: 'ID поста',
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
    description: 'Количество комментариев на странице',
    example: 10,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Комментарии к посту',
    type: [CommentDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Пост не найден' 
  })
  async getPostComments(
    @Param('postId') postId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    // return this.commentService.findByPostId(postId, { page, limit });
    return { message: 'Get post comments endpoint - requires implementation' };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить комментарий по ID',
    description: 'Возвращает детальную информацию о комментарии'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID комментария',
    example: 'clx1234567890abcdef'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные комментария',
    type: CommentDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Комментарий не найден' 
  })
  async getCommentById(@Param('id') id: string) {
    // return this.commentService.findById(id);
    return { message: 'Get comment by ID endpoint - requires implementation' };
  }

  @Post()
  @UseGuards(GqlAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('session')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Создать новый комментарий',
    description: 'Добавляет комментарий к посту'
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Комментарий успешно создан',
    type: CommentDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные комментария' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Пост не найден' 
  })
  async createComment(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    // return this.commentService.create(createCommentDto, req.user.id);
    return { message: 'Create comment endpoint - requires implementation' };
  }

  @Put(':id')
  @UseGuards(GqlAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('session')
  @ApiOperation({ 
    summary: 'Обновить комментарий',
    description: 'Обновляет существующий комментарий (только автор)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID комментария',
    example: 'clx1234567890abcdef'
  })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Комментарий обновлен',
    type: CommentDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав на редактирование комментария' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Комментарий не найден' 
  })
  async updateComment(
    @Param('id') id: string, 
    @Body() updateCommentDto: UpdateCommentDto, 
    @Request() req
  ) {
    // return this.commentService.update(id, updateCommentDto, req.user.id);
    return { message: 'Update comment endpoint - requires implementation' };
  }

  @Delete(':id')
  @UseGuards(GqlAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('session')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Удалить комментарий',
    description: 'Удаляет комментарий (только автор)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID комментария',
    example: 'clx1234567890abcdef'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Комментарий удален' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав на удаление комментария' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Комментарий не найден' 
  })
  async deleteComment(@Param('id') id: string, @Request() req) {
    // return this.commentService.remove(id, req.user.id);
    return { message: 'Delete comment endpoint - requires implementation' };
  }
}
