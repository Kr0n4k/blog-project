import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  controllers: [CommentsController],
  providers: [PrismaService],
  exports: []
})
export class CommentsModule {}
