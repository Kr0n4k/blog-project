import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostService } from '../user/post/post.service';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  controllers: [PostsController],
  providers: [PostService, PrismaService],
  exports: [PostService]
})
export class PostsModule {}
