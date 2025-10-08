// post.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreatePostInput } from './inputs/create-post.input';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PostService {
    private pubSub = new PubSub();

    public constructor(private readonly prismaService: PrismaService) {}

    public async createPost(post: CreatePostInput, userId: string) {
        const { title, videos, photos, text } = post;

        const newPost = await this.prismaService.post.create({
            data: {
                title,
                text: text || '',
                videos: videos || [],
                photos: photos || [],
                userId,
            }
        });

        return newPost;
    }

    public async getPostsByUser(userId: string) {
        return await this.prismaService.post.findMany({
            where: {
                userId
            },
            include: {
                likes: true,
                comments: true,
                user: {
                    select: {
                        userName: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        })
    }

    public async createComment(postId: string, userId: string, text: string) {
        // Добавлен return
        const comment = await this.prismaService.comment.create({
            data: {
                postId,
                userId,
                text
            }
        });
        
        // Публикуем событие о новом комментарии
        this.pubSub.publish('commentAdded', { commentAdded: comment });
        
        return comment;
    }

    public async likePost(postId: string, userId: string) {
        // Добавлен return
        const like = await this.prismaService.like.create({
            data: {
                postId,
                userId
            }
        });
        
        // Публикуем событие о новом лайке
        this.pubSub.publish('likeAdded', { likeAdded: like });
        
        return like;
    }

    public async updateComment(commentId: string, userId: string, text: string) {
        // Проверяем, что комментарий принадлежит пользователю
        const comment = await this.prismaService.comment.findFirst({
            where: { id: commentId, userId }
        });

        if (!comment) {
            throw new Error('Comment not found or access denied');
        }

        const updatedComment = await this.prismaService.comment.update({
            where: { id: commentId },
            data: { text }
        });
        
        // Публикуем событие об обновлении комментария
        this.pubSub.publish('commentUpdated', { commentUpdated: updatedComment });
        
        return updatedComment;
    }

    public async deleteComment(commentId: string, userId: string) {
        // Проверяем, что комментарий принадлежит пользователю
        const comment = await this.prismaService.comment.findFirst({
            where: { id: commentId, userId }
        });

        if (!comment) {
            throw new Error('Comment not found or access denied');
        }

        const deletedComment = await this.prismaService.comment.delete({
            where: { id: commentId }
        });
        
        // Публикуем событие об удалении комментария
        this.pubSub.publish('commentDeleted', { commentDeleted: deletedComment });
        
        return deletedComment;
    }

    public async getRandomPosts(limit: number = 10) {
        return await this.prismaService.post.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                likes: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                userName: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        userName: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        })
    }

    public async findById(id: string) {
        return await this.prismaService.post.findUnique({
            where: { id },
            include: {
                likes: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                userName: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        userName: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        })
    }

    public async create(createPostDto: any, userId: string) {
        const { title, videos, photos, text } = createPostDto;
        return await this.prismaService.post.create({
            data: {
                title,
                text: text || '',
                videos: videos || [],
                photos: photos || [],
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        userName: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });
    }

    public async update(id: string, updatePostDto: any, userId: string) {
        // Проверяем, что пост принадлежит пользователю
        const post = await this.prismaService.post.findFirst({
            where: { id, userId }
        });

        if (!post) {
            throw new Error('Post not found or access denied');
        }

        return await this.prismaService.post.update({
            where: { id },
            data: updatePostDto,
            include: {
                user: {
                    select: {
                        id: true,
                        userName: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });
    }

    public async remove(id: string, userId: string) {
        // Проверяем, что пост принадлежит пользователю
        const post = await this.prismaService.post.findFirst({
            where: { id, userId }
        });

        if (!post) {
            throw new Error('Post not found or access denied');
        }

        return await this.prismaService.post.delete({
            where: { id }
        });
    }

    public async findByUserId(userId: string, options: { page: number; limit: number }) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;

        return await this.prismaService.post.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                likes: true,
                comments: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });
    }

    public async searchPosts(query: string, limit: number = 10, offset: number = 0) {
        return await this.prismaService.post.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { text: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: limit,
            skip: offset,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                likes: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                userName: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        userName: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        })
    }

    // Методы подписок для real-time обновлений
    public likeAddedSubscription(postId: string) {
        return this.pubSub.asyncIterator('likeAdded');
    }

    public commentAddedSubscription(postId: string) {
        return this.pubSub.asyncIterator('commentAdded');
    }

    public commentUpdatedSubscription(postId: string) {
        return this.pubSub.asyncIterator('commentUpdated');
    }

    public commentDeletedSubscription(postId: string) {
        return this.pubSub.asyncIterator('commentDeleted');
    }
}