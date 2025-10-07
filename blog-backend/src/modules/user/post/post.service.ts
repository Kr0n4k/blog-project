// post.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreatePostInput } from './inputs/create-post.input';

@Injectable()
export class PostService {
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
        return await this.prismaService.comment.create({
            data: {
                postId,
                userId,
                text
            }
        })
    }

    public async likePost(postId: string, userId: string) {
        // Добавлен return
        return await this.prismaService.like.create({
            data: {
                postId,
                userId
            }
        })
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
}