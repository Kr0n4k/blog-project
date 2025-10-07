import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../../../core/prisma/prisma.service';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    const createPostInput = {
      title: 'Test Post',
      text: 'This is a test post',
      photos: ['photo1.jpg'],
      videos: ['video1.mp4'],
    };
    const userId = 'user123';

    it('should create a new post', async () => {
      const mockPost = {
        id: 'post123',
        ...createPostInput,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.createPost(createPostInput, userId);

      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: {
          title: createPostInput.title,
          text: createPostInput.text,
          videos: createPostInput.videos,
          photos: createPostInput.photos,
          userId,
        },
      });
      expect(result).toEqual(mockPost);
    });
  });

  describe('getRandomPosts', () => {
    it('should return random posts with default limit', async () => {
      const mockPosts = [
        {
          id: 'post1',
          title: 'Post 1',
          text: 'Content 1',
          user: { id: 'user1', userName: 'user1' },
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.getRandomPosts();

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockPosts);
    });

    it('should return random posts with custom limit', async () => {
      const limit = 5;
      const mockPosts = [];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.getRandomPosts(limit);

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockPosts);
    });
  });

  describe('findById', () => {
    it('should return post by id', async () => {
      const postId = 'post123';
      const mockPost = {
        id: postId,
        title: 'Test Post',
        text: 'Test content',
        user: { id: 'user1', userName: 'user1' },
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      const result = await service.findById(postId);

      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockPost);
    });
  });

  describe('create', () => {
    const createPostDto = {
      title: 'New Post',
      text: 'New content',
      photos: ['photo1.jpg'],
      videos: [],
    };
    const userId = 'user123';

    it('should create a new post', async () => {
      const mockPost = {
        id: 'post123',
        ...createPostDto,
        userId,
        user: { id: userId, userName: 'user1' },
      };

      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.create(createPostDto, userId);

      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: {
          title: createPostDto.title,
          text: createPostDto.text,
          videos: createPostDto.videos,
          photos: createPostDto.photos,
          userId,
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    const postId = 'post123';
    const userId = 'user123';
    const updatePostDto = {
      title: 'Updated Post',
      text: 'Updated content',
    };

    it('should update post if user owns it', async () => {
      const mockPost = { id: postId, userId };
      const updatedPost = { ...mockPost, ...updatePostDto };

      mockPrismaService.post.findFirst.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue(updatedPost);

      const result = await service.update(postId, updatePostDto, userId);

      expect(mockPrismaService.post.findFirst).toHaveBeenCalledWith({
        where: { id: postId, userId },
      });
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: updatePostDto,
        include: expect.any(Object),
      });
      expect(result).toEqual(updatedPost);
    });

    it('should throw error if post not found or access denied', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(null);

      await expect(service.update(postId, updatePostDto, userId)).rejects.toThrow(
        'Post not found or access denied',
      );
      expect(mockPrismaService.post.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const postId = 'post123';
    const userId = 'user123';

    it('should delete post if user owns it', async () => {
      const mockPost = { id: postId, userId };

      mockPrismaService.post.findFirst.mockResolvedValue(mockPost);
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await service.remove(postId, userId);

      expect(mockPrismaService.post.findFirst).toHaveBeenCalledWith({
        where: { id: postId, userId },
      });
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(result).toEqual(mockPost);
    });

    it('should throw error if post not found or access denied', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(null);

      await expect(service.remove(postId, userId)).rejects.toThrow(
        'Post not found or access denied',
      );
      expect(mockPrismaService.post.delete).not.toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    const userId = 'user123';
    const options = { page: 1, limit: 10 };

    it('should return posts by user id with pagination', async () => {
      const mockPosts = [
        {
          id: 'post1',
          title: 'Post 1',
          userId,
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.findByUserId(userId, options);

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockPosts);
    });
  });
});
